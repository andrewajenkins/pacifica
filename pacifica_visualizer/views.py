import logging
from datetime import datetime

from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.views import APIView

from pacifica_visualizer.models import Message
from pacifica_visualizer.reports import get_abcs, get_daily
from pacifica_visualizer.serializers import MessageSerializer

logger = logging.getLogger(__name__)


@api_view(['GET'])
def report_list(request):
    if request.query_params.get('type') == 'abc':
        return JsonResponse(get_abcs(), status=status.HTTP_200_OK, safe=False)
    elif request.query_params.get('type') == 'daily':
        return JsonResponse(get_daily(), status=status.HTTP_200_OK, safe=False)
    else:
        raise LookupError("Failed to find query type")


class MessageView(APIView):
    def get(self, request):
        all_messages = reversed(Message.objects.all())
        response = MessageSerializer(all_messages, many=True).data
        return Response(response, status.HTTP_200_OK)

    def post(self, request):
        submitted_message = request.data.get('message', None)
        user_name = request.data.get('user', None)
        logger.info(f"Message: post: creating message: {submitted_message}")
        logger.info(f"Message: post: user: {user_name}")
        Message.objects.create(user=user_name, username=user_name, message=submitted_message, timestamp=datetime.now())
        return Response(status.HTTP_204_NO_CONTENT)

    def put(self, request):
        print('halp!')

        return Response('derp', status.HTTP_200_OK)

    def delete(self, request):
        message_id = request.query_params.get('pk', None)
        Message.objects.get(pk=message_id).delete()
        return Response(status.HTTP_204_NO_CONTENT)