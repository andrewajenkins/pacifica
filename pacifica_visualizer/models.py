from django.db import models


# Create your models here.
class Sheet(models.Model):
    address = models.CharField(max_length=70, blank=False, default='')
    name = models.CharField(max_length=200,blank=False, default='')
    active = models.BooleanField(default=False)