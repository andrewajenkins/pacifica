import json
from django.core.management.base import BaseCommand

from pacifica_visualizer.models import Client


class Command(BaseCommand):
    help = 'Loads initial clients from json file to database'

    def handle(self, *args, **options):
        f = open('pacifica_visualizer/management/data/client_data.json',)
        data = json.load(f)

        for client in data:
            Client.objects.get_or_create(
                first_name=client['first_name'],
                last_name=client['last_name'],
                abcs_id=client['abcs_id']
            )

        f.close()
