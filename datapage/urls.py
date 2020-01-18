from django.contrib import admin
from django.urls import path
from .views import get_data, get_objects_sort, get_log_sort,\
                    get_strikes, get_own_data

#sort=ВЛ=null=0=РУП%20«БРЕСТЭНЕРГО»=Гомельские%20электрические%20сети=null=null.json
#log=null=null=220=null=null=null=null=2019-07-14%2014:02:00%20+0300=2019-07-14%2014:04:00%20+0300.json
#strikes=2019-07-14%2014:02:00%20+0300=2019-07-14%2014:04:00%20+0300.json
urlpatterns = [
    path(r'coordinates.json', get_data),
    path(r'sort=<str:tp>=<str:name>=<int:unom>=<str:rup>=<str:branch>=<str:region>=<str:district>.json', get_objects_sort),
    path(r'log=<str:tp>=<str:name>=<int:unom>=<str:rup>=<str:branch>=<str:region>=<str:district>=<str:dst>=<str:dnd>=<int:dist>.json', get_log_sort),
    path(r'strikes=<str:dst>=<str:dnd>.json', get_strikes),
    path(r'own_data.json', get_own_data)
]