import logging
from datetime import datetime, date, timedelta

from django.db.models import Q
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


class GraphView(APIView):
    def get(self, request):
        client = request.query_params.get("client", None)

        startdate = datetime.today()
        enddate = startdate - timedelta(days=90)

        print(f"client: {client}")
        if client == "All":
            filter_query = Q(timestamp__gte=enddate)
        else:
            filter_query = Q(client__first_name=client, timestamp__range=[startdate, enddate])

        # for abc in ABC.objects.all():
        #     print(f"test: {abc.timestamp}, enddate: {enddate}")
        abcs = ABC.objects.filter(filter_query).order_by("timestamp")
        # for abc in abcs:
        #     print(f"test2: {abc.timestamp}, enddate: {enddate}")
        logger.info(f"abcs: {abcs}")

        abc_weekly_count = []
        for i in range(0, 11):
            end_date = startdate - timedelta(days=7)
            print(f"startdate: {startdate}, end_date: {end_date}")
            range_abcs = abcs.filter(timestamp__range=[end_date, startdate]).count()
            logger.info(f"found range: {range_abcs}")
            startdate = end_date - timedelta(days=1)
            abc_weekly_count.append({
                "timestamp": startdate,
                "count": range_abcs
            })

        print(f"abc_weekly_count: {abc_weekly_count}")

        # abc_data = GraphSerializer(abcs, many=True).data
        # return Response(abc_data, status.HTTP_200_OK)
        # response = [
        #     {"Framework": "Vue", "Stars": "166443", "Released": "2014"},
        #     {"Framework": "React", "Stars": "150793", "Released": "2013"},
        #     {"Framework": "Angular", "Stars": "62342", "Released": "2016"},
        #     {"Framework": "Backbone", "Stars": "27647", "Released": "2010"},
        #     {"Framework": "Ember", "Stars": "21471", "Released": "2011"},
        # ]
        return Response(abc_weekly_count, status.HTTP_200_OK)