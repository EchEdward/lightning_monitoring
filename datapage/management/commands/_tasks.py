# pylint: disable=E1101
from datetime import datetime, timedelta
from django.conf import settings

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from datapage.models import Strikes, Coordinates_VL, Log_Strikes, Coordinates_PS

import pytz
import requests
import json
import random


from _geo import haversine, isnearby_vl, isnearby_ps, OnePoint


lz= pytz.timezone('Iceland')# pytz.timezone(settings.TIME_ZONE)

latitude, longitude = 53.9012, 27.5607
radius = 350


def Change_time(all_strikes):
    for i in range(len(all_strikes)): 
        all_strikes[i][2] = lz.localize(datetime.strptime(all_strikes[i][2][:26], '%Y-%m-%d %H:%M:%S.%f'))

def near_and_time(i,last):
    return i[2] > last and haversine(latitude, longitude, i[1], i[0]) <= radius

def get_dt():
    try:
        last_data = Strikes.objects.latest('date_time').date_time
    except Exception:
        #print("bad")
        return datetime.now(pytz.timezone(settings.TIME_ZONE)) - timedelta(days=1)
    else:
        #print("good")
        return last_data

def Get_line_sqare(lat,lon):
    p1 = OnePoint((lat,lon),-45,20)
    p2 = OnePoint((lat,lon), 135,20)
    crd = Coordinates_VL.objects.filter(lat__range=(p2[0],p1[0]),lon__range=(p1[1],p2[1])).order_by("energy_objects","line","iterate")
    d = {}
    obj = None
    for i in crd:
        if i.energy_objects not in d:
            d[i.energy_objects] = {}
        if i.line not in d[i.energy_objects]:
            d[i.energy_objects][i.line] = []
            if i.first != -1:
                try:
                    one = Coordinates_VL.objects.get(energy_objects = i.energy_objects,\
                                                    line = i.line, iterate =  i.first)
                except Coordinates_VL.DoesNotExist:
                    pass
                else:
                    #print("added firs")
                    d[i.energy_objects][i.line].append((one.lat,one.lon))

            if obj is not None:
                if obj.last != -1:
                    try:
                        one = Coordinates_VL.objects.get(energy_objects = obj.energy_objects,\
                                                        line = obj.line, iterate =  obj.first)
                    except Coordinates_VL.DoesNotExist:
                        pass
                    else:
                        #print("added last")
                        d[obj.energy_objects][obj.line].append((one.lat,one.lon))

        d[i.energy_objects][i.line].append((i.lat,i.lon))
        obj = i

    return d



def notify_user():
    """
    s = Strikes(lat = 53,\
                    lon = 25,\
                    date_time = datetime.now(pytz.timezone(settings.TIME_ZONE)))
    s.save()
    """

    try:
        last = get_dt()
        response = requests.get("http://map.blitzortung.org/GEOjson/strikes_0.json")
        all_strikes = json.loads(response.text)
        Change_time(all_strikes)
        strikes = sorted(list(filter(lambda i :near_and_time(i,last), all_strikes)), key=lambda i:i[2])
    
    
        i = 0
        i1 = 0
        for strike in strikes:
            strike_save = False
            s = Strikes(lat = strike[1],\
                        lon = strike[0],\
                        date_time = strike[2])
            #s.save()
            i+=1
    
            d = Get_line_sqare(strike[1],strike[0])
            for k1 in d:
                for k2 in d[k1]:
                    min_dist = float("inf")
                    for r in range(1,len(d[k1][k2])):
                        dist = isnearby_vl((strike[1],strike[0]),[d[k1][k2][r-1],d[k1][k2][r]])
                        if dist is not None:
                            min_dist = min(dist,min_dist)
    
                    if min_dist<float("inf"):
                        i1+=1
    
                        if not strike_save:
                            strike_save = True
                            s.save()
    
                        l = Log_Strikes(energy_objects = k1,\
                                    strikes = s,\
                                    distance = round(min_dist,2))
                        l.save()
    
            p1 = OnePoint((strike[1],strike[0]),-45,0.5)
            p2 = OnePoint((strike[1],strike[0]), 135,0.5)
    
            ps = Coordinates_PS.objects.filter(lat__range=(p2[0],p1[0]),lon__range=(p1[1],p2[1]))
            for p in ps:
                dist = isnearby_ps((strike[1],strike[0]),(p.lat,p.lon))
                if dist is not None:
                            i1+=1
    
                            if not strike_save:
                                strike_save = True
                                s.save()
    
                            l = Log_Strikes(energy_objects = p.energy_objects,\
                                        strikes = s,\
                                        distance = round(dist,2))
                            l.save()
    except Exception:
        pass

