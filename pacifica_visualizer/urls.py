from django.conf.urls import url
from pacifica_visualizer.views import MessageView, ReportView

urlpatterns = [
    url(r'^api/report$', ReportView.as_view(), name='report-view'),
    url(r'^api/message$', MessageView.as_view(), name='message-views'),
]