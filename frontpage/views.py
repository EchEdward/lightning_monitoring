from django.shortcuts import render_to_response, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.conf import settings
from lightning_server.settings import security_data


# Create your views here.

api_key = security_data["yandex-map-api-key"]

def mainpage(request):
    if not request.user.is_authenticated:
        return redirect('%s?next=%s' % (settings.LOGIN_URL, request.path))
    return render_to_response('map.html',{"api_key":api_key})


def logout_view(request):
    logout(request)
    return redirect('%s?next=%s' % (settings.LOGIN_URL, ''))
    # Redirect to a success page.