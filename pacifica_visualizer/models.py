from datetime import datetime

from django.contrib import admin
from django.db import models
from rest_framework.fields import JSONField


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

    def __str__(self):
        return "{} {}".format(self.first_name, self.last_name)


class Message(models.Model):
    timestamp = models.DateTimeField(max_length=70, blank=False, default="MISSING_TIMESTAMP")
    username = models.CharField(max_length=70, blank=False, default='USERNAME')
    message = models.CharField(max_length=5000, blank=False, default='MESSAGE')
    user = models.CharField(max_length=70, blank=False, default='USER')

    class Meta:
        ordering = ['-timestamp']


class ABC(models.Model):
    timestamp = models.DateTimeField(max_length=70, blank=False, default="MISSING_TIMESTAMP")
    client = models.ForeignKey(Client, blank=False, null=False, on_delete=models.CASCADE)
    staff = models.CharField(max_length=70, blank=False, default='STAFF')
    antecedent = models.CharField(max_length=5000, blank=False, default='ANTECEDENT')
    behavior = models.CharField(max_length=5000, blank=False, default='BEHAVIOR')
    notes = models.CharField(max_length=5000, null=True, default='NOTES')
    duration = models.CharField(max_length=5000, blank=False, default='DURATION')
    place = models.CharField(max_length=5000, blank=False, default='PLACE')
    consequence = models.CharField(max_length=5000, blank=False, default='CONSEQUENCE')
    ipp = models.CharField(max_length=5000, null=True, default='IPP')
    data = JSONField()

    class Meta:
        unique_together = ('timestamp', 'client', 'staff', 'behavior')
        ordering = ['-timestamp']


class DailyNote(models.Model):
    timestamp = models.DateTimeField(max_length=70, blank=False, default="MISSING_TIMESTAMP")
    client = models.ForeignKey(Client, blank=False, null=False, on_delete=models.CASCADE)
    staff = models.CharField(max_length=70, blank=False, default='STAFF')
    period = models.CharField(max_length=70, blank=False, default='PERIOD')
    notes = models.CharField(max_length=5000, null=True, default='NOTES')
    headers = models.CharField(max_length=5000, null=True, default='HEADERS')
    raw_data = models.CharField(max_length=5000, null=True, default='RAW_DATA')

    class Meta:
        unique_together = ('timestamp', 'client', 'staff', 'notes')
        ordering = ['-timestamp']


    # def __init__(self, json_data):
    #     self.json_data = json_data