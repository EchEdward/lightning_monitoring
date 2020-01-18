"""lightning_server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from datapage.tasks import notify_user

from datapage.urls import urlpatterns as datapage_url
from frontpage.urls import urlpatterns as frontpage_url

urlpatterns = [
    path('admin/', admin.site.urls),
]

urlpatterns+=datapage_url
urlpatterns+=frontpage_url

import threading
import time

def clock(interval):
    while True:
        notify_user()
        time.sleep(interval)
t = threading.Thread(target=clock, args=(60,))
#t.daemon = True
t.start()