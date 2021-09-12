from django.contrib import admin

# Register your models here.
from pacifica_visualizer.models import Client, Message, ABC, DailyNote

admin.site.register(Client)
admin.site.register(Message)
admin.site.register(ABC)
admin.site.register(DailyNote)