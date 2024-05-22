"""
URL configuration for Food_check project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from check import views
from django.http import HttpResponseNotFound

urlpatterns = [
    path('check/',views.check, name='check'),
    path('data/', views.data, name='data'),
    path('receive-data/', views.receive_data, name='receive_data'),
    path('get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),
    path('favicon.ico', lambda request: HttpResponseNotFound()),
    path('admin/', admin.site.urls),
]
