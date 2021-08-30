from django.conf.urls import url
from pacifica_visualizer import views

urlpatterns = [
    url(r'^api/report$', views.report_list),
]