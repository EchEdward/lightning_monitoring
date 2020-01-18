from django.contrib import admin
from datapage.models import Object_type, Region, District, RUP, Branch,\
                            EnergyObjects, Coordinates_PS, Coordinates_VL,\
                            Strikes, Log_Strikes, Links
# Register your models here.

class DistrictAdmin(admin.ModelAdmin): # предназначен описания вида представления инфы строк таблицы в админке
    list_display = ('district', 'region')  # описывает какие данные будут отображаться, и сортировка по ним
    search_fields = ('district','region__region') # добавляем панель поиска #, 'region__region__region'

class BranchAdmin(admin.ModelAdmin): 
    list_display = ('branch', 'rup')  
    search_fields = ('branch','rup__rup') 

class StrikeshAdmin(admin.ModelAdmin): 
    list_display = ('date_time', 'lat','lon')#,'square_lat','square_lon'
    list_filter = ('date_time',) # добавляем фильтр по датам
    date_hierarchy = 'date_time' # добавлят новигационную панель по годам
    search_fields = ('lat','lon') 

class Log_StrikesAdmin(admin.ModelAdmin): 
    list_display = ('energy_objects', 'strikes','distance')
    search_fields = ('energy_objects__name',) 
    list_filter = ('strikes__date_time',)
    date_hierarchy = 'strikes__date_time' 

class EnergyObjectsAdmin(admin.ModelAdmin): 
    list_display = ('name', 'object_type','voltage_class')
    search_fields = ('object_type__object_type','name','voltage_class') 

class Coordinates_VLAdmin(admin.ModelAdmin): 
    list_display = ('energy_objects', 'line','iterate','lat','lon')#,'square_lat','square_lon'
    search_fields = ('energy_objects__name',) 

class Coordinates_PSAdmin(admin.ModelAdmin): 
    list_display = ('energy_objects', 'lat','lon')#,'square_lat','square_lon'
    search_fields = ('energy_objects__name',) 

class LinksAdmin(admin.ModelAdmin): 
    list_display = ('energy_objects', 'branch','district')
    search_fields = ('energy_objects__name','branch__branch','district__district') 
    

 
admin.site.register(Object_type) 
admin.site.register(Region) 
admin.site.register(District,DistrictAdmin) 
admin.site.register(Branch, BranchAdmin) 
admin.site.register(EnergyObjects, EnergyObjectsAdmin) 
admin.site.register(Coordinates_PS, Coordinates_PSAdmin) 
admin.site.register(Coordinates_VL, Coordinates_VLAdmin) 
admin.site.register(Strikes, StrikeshAdmin) 
admin.site.register(Log_Strikes,Log_StrikesAdmin) 
admin.site.register(Links, LinksAdmin) 
admin.site.register(RUP) 


# admin.site.register(Book, BookAdmin)

