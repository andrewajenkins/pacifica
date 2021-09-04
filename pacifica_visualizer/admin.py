from django.contrib import admin

# Register your models here.
from pacifica_visualizer.models import Client, Message

admin.site.register(Client)
admin.site.register(Message)