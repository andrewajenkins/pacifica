from django.conf.urls import url
from pacifica_visualizer import views

urlpatterns = [
    url(r'^api/sheet$', views.sheet_list),
    url(r'^api/sheet/(?P<pk>[0-9]+)$', views.sheet_detail),
    url(r'^api/sheet/active$', views.sheet_list_active)
]