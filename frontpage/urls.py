from django.urls import path, include
from .views import mainpage, logout_view

urlpatterns = [path(r'', mainpage),\
    path('accounts/', include('django.contrib.auth.urls')),
    path('logout', logout_view)]