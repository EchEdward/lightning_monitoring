# pylint: disable=E1101
from django.shortcuts import render, HttpResponse, render_to_response
from .models import Coordinates_VL, EnergyObjects, Links, Log_Strikes, Strikes,\
                    Object_type, Region, District, RUP, Branch, Coordinates_PS
from django.http import JsonResponse
from django.conf import settings
from datetime import datetime, timedelta
import pytz


lz = pytz.timezone(settings.TIME_ZONE)
# Create your views here.

def get_data(request):
    d = {}
    if not request.user.is_authenticated:
        return JsonResponse(d, safe=False)

    vls = EnergyObjects.objects.all().order_by("name")
    for vl in vls:
        if vl.object_type.object_type == "ВЛ":
            d[vl.id] = {}
            d[vl.id]["name"] = vl.name
            d[vl.id]["object_type"] = vl.object_type.object_type
            d[vl.id]["voltage_class"] = vl.voltage_class
            d[vl.id]["line"] = {}
            cord = Coordinates_VL.objects.filter(energy_objects=vl).order_by("line","iterate")

            p1_lat, p1_lon = float("inf"), float("-inf")
            p2_lat, p2_lon = float("-inf"), float("inf")

            for c in cord:
                if c.line not in d[vl.id]["line"]:
                    d[vl.id]["line"][c.line]=[]
                d[vl.id]["line"][c.line].append([c.lat,c.lon])
                p1_lat, p1_lon = min(p1_lat,c.lat), max(p1_lon,c.lon)
                p2_lat, p2_lon = max(p2_lat,c.lat), min(p2_lon,c.lon)

            d[vl.id]["bounds"] = [[p1_lat, p2_lon],[p2_lat, p1_lon]]

        elif vl.object_type.object_type == "ПС":
            ps = Coordinates_PS.objects.get(energy_objects=vl)
            d[ps.energy_objects.id] = {}
            d[ps.energy_objects.id]["name"] = ps.energy_objects.name
            d[ps.energy_objects.id]["object_type"] = ps.energy_objects.object_type.object_type
            d[ps.energy_objects.id]["voltage_class"] = ps.energy_objects.voltage_class
            d[ps.energy_objects.id]["cord"] = [ps.lat,ps.lon]


    #print("good")
    return JsonResponse(d, safe=False)

def get_objects_sort(request,tp,name,unom,rup,branch,region,district):
    #print("sort")
    lst1 = [tp,name,unom,rup,branch,region,district]
    lst2 = ["energy_objects__object_type__object_type__icontains",\
            "energy_objects__name__icontains",'energy_objects__voltage_class',\
            'branch__rup__rup__icontains', 'branch__branch__icontains',\
            'district__region__region__icontains','district__district__icontains']
    d = {lst2[i]:lst1[i] for i in range(len(lst1)) if lst1[i]!='null' and lst1[i]!=0}
    rez = Links.objects.filter(**d)
    return JsonResponse(list(set([i.energy_objects.id for i in rez])), safe=False)

def get_log_sort(request,tp,name,unom,rup,branch,region,district,dst,dnd,dist):
    #print("log")
    dst = datetime.strptime(dst, '%Y-%m-%d %H:%M:%S %z') if dst!="null" else dst
    dnd = datetime.strptime(dnd, '%Y-%m-%d %H:%M:%S %z') if dnd!="null" else dnd

    lst1 = [tp,name,unom,(dst,dnd),dist]
    lst2 = ["energy_objects__object_type__object_type__icontains",\
            "energy_objects__name__icontains",\
            "energy_objects__voltage_class",\
            "strikes__date_time__range",\
            "distance__lte"]
    d1 = {lst2[i]:lst1[i] for i in range(len(lst1)) if lst1[i]!='null' and lst1[i]!=0}

    lst3 = [tp,name,unom,rup,branch,region,district]
    lst4 = ["energy_objects__object_type__object_type__icontains",\
            "energy_objects__name__icontains",'energy_objects__voltage_class',\
            'branch__rup__rup__icontains', 'branch__branch__icontains',\
            'district__region__region__icontains','district__district__icontains']
    d2 = {lst4[i]:lst3[i] for i in range(len(lst3)) if lst3[i]!='null' and lst3[i]!=0}

    order = []
    obj = {}
    strikes = {}
    
    if rup=="null" and branch=="null" and region=="null" and district=="null":
        rez = Log_Strikes.objects.filter(**d1).order_by("-strikes__date_time")
        for r in rez:
            order.append(str(r.id))
            obj[str(r.id)] = {"energy_object":str(r.energy_objects.id),
                                    "distance":r.distance,
                                    "strike":str(r.strikes.id)}
            if str(r.strikes.id) not in strikes:
                strikes[str(r.strikes.id)]={"date": r.strikes.date_time.strftime('%Y-%m-%d %H:%M:%S %z'),
                                            "lat":r.strikes.lat,
                                            "lon":r.strikes.lon}


    else:
        id_obj = set()
        rez = Links.objects.filter(**d2)
        for r in rez:
            if r.energy_objects.id in id_obj:
                continue
            id_obj.add(r.energy_objects.id)
            rez2 = Log_Strikes.objects.filter(energy_objects=r.energy_objects,\
                                            strikes__date_time__range=(dst,dnd),
                                            distance__lte=dist).order_by("-strikes__date_time")
            for r2 in rez2:
                order.append(str(r2.id))
                obj[str(r2.id)]={"energy_object":str(r2.energy_objects.id),
                                "distance":r2.distance,
                                "strike":str(r2.strikes.id)}
                if str(r2.strikes.id) not in strikes:
                    strikes[str(r2.strikes.id)]={"date": r2.strikes.date_time.strftime('%Y-%m-%d %H:%M:%S %z'),
                                                "lat":r2.strikes.lat,
                                                "lon":r2.strikes.lon}

    return JsonResponse([order,obj,strikes], safe=False)

def get_strikes(request,dst,dnd):
    dst = datetime.strptime(dst, '%Y-%m-%d %H:%M:%S %z') if dst!="null" else dst
    dnd = datetime.strptime(dnd, '%Y-%m-%d %H:%M:%S %z') if dnd!="null" else dnd

    rez = Strikes.objects.filter(date_time__range=(dst,dnd)).order_by("-date_time")
    obj = [{"lat":r.lat,"lon":r.lon,"date":r.date_time.strftime('%Y-%m-%d %H:%M:%S %z')} for r in rez]
    return JsonResponse(obj, safe=False)

def get_own_data(request):
    d1 = {}
    rez1 = Branch.objects.all()
    for r in rez1:
        #print(r.rup.rup, r.id)
        if r.rup.rup not in d1:
            d1[r.rup.rup]=[]
        d1[r.rup.rup].append(r.branch)

    d2 = {}
    rez2 = District.objects.all()
    for r in rez2:
        if r.region.region not in d2:
            d2[r.region.region]=[]
        d2[r.region.region].append(r.district)

    d3 = [r.object_type for r in Object_type.objects.all()]

    return JsonResponse([d1,d2,d3], safe=False)


    





