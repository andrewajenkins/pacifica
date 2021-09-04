from django.conf.urls import url
from pacifica_visualizer import views
from pacifica_visualizer.views import MessageView

urlpatterns = [
    url(r'^api/report$', views.report_list),
    url(r'^api/message$', MessageView.as_view(), name='message-views'),
]