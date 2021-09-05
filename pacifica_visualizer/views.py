import logging
from datetime import datetime

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from pacifica_visualizer.models import Message, ABC, DailyNote
from pacifica_visualizer.reports import update_abcs, update_dailies, archive_reports
from pacifica_visualizer.serializers import MessageSerializer, ABCSerializer, DailyNoteSerializer

logger = logging.getLogger(__name__)


class ReportView(APIView):
    def get(self, request):
        if request.query_params.get('type') == 'abc':
            abcs = ABC.objects.all()
            abc_data = ABCSerializer(abcs, many=True).data
            return Response(abc_data, status.HTTP_200_OK)
        elif request.query_params.get('type') == 'daily':
            dailies = DailyNote.objects.all()
            dailies_data = DailyNoteSerializer(dailies, many=True).data
            return Response (dailies_data, status.HTTP_200_OK)
        elif request.query_params.get('type') == 'file':
            return archive_reports(request.query_params.get('days'))
        else:
            raise LookupError("Failed to find query type")

    def post(self, request):
        logger.info("POST to trigger updates!")
        trigger_data_update = request.data.get("trigger_data_update", None)
        if trigger_data_update:
            update_abcs()
            update_dailies()
        return Response(status.HTTP_204_NO_CONTENT)


class MessageView(APIView):
    def get(self, request):
        all_messages = Message.objects.all()
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
        return Response(status.HTTP_200_OK)

    def delete(self, request):
        message_id = request.query_params.get('pk', None)
        Message.objects.get(pk=message_id).delete()
        return Response(status.HTTP_204_NO_CONTENT)