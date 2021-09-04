from rest_framework import serializers
from .models import Sheet, Message


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