import json

from rest_framework import serializers
from rest_framework.fields import CharField, DateTimeField, SerializerMethodField

from .models import Sheet, Message, ABC, DailyNote


class SheetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sheet
        fields = ('id',
                  'address',
                  'name',
                  'active')


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id',
                  'timestamp',
                  'username',
                  'message',
                  'user')


class ABCSerializer(serializers.ModelSerializer):
    client = CharField(source="client.first_name", default=None)

    class Meta:
        model = ABC
        fields = ('id',
                  'timestamp',
                  'client',
                  'staff',
                  'antecedent',
                  'behavior',
                  'notes',
                  'duration',
                  'place',
                  'consequence',
                  'ipp',)


class DailyNoteSerializer(serializers.ModelSerializer):
    client = CharField(source="client.first_name", default=None)

    class Meta:
        model = DailyNote
        fields = ('id',
                  'timestamp',
                  'client',
                  'staff',
                  'period',
                  'notes',
                  'headers',
                  'raw_data',)
