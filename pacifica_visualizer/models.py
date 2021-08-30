from django.db import models


class Sheet(models.Model):
    address = models.CharField(max_length=70, blank=False, default='')
    name = models.CharField(max_length=200,blank=False, default='')
    active = models.BooleanField(default=False)


class Client(models.Model):
    first_name = models.CharField(max_length=70, blank=False, default='FIRST_NAME_MISSING')
    last_name = models.CharField(max_length=70, blank=False, default='LAST_NAME_MISSING')
    abcs_id = models.CharField(max_length=200, blank=False, default='')
    am_notes_id = models.CharField(max_length=200, blank=False, default='')
    pm_notes_id = models.CharField(max_length=200, blank=False, default='')