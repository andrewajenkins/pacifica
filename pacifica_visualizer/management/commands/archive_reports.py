import io
import json
import logging
from datetime import datetime, timedelta

from django.core.management.base import BaseCommand

from pacifica_visualizer.models import DailyNote

from django.core.mail import EmailMessage

from reportlab.lib.pagesizes import letter, landscape

from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Archive and email todays reports'

    def handle(self, *args, **options):
        notes_to_archive = DailyNote.objects.filter(timestamp__gte=(datetime.now() - timedelta(days=3)))
        # for entry in notes_to_archive:
        #     logger.info(f"include entry {entry.timestamp}")
        # logger.info(f"count: {notes_to_archive.count()}")

        doc = SimpleDocTemplate("archived_report.pdf", pagesize=landscape(letter),
                                rightMargin=72, leftMargin=72,
                                topMargin=72, bottomMargin=18)

        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY))

        Story = []
        logo = "pacificafrontend/src/assets/img/bird-of-paradise.jpeg"

        im = Image(logo, 3 * inch, 3 * inch)
        Story.append(im)

        for entry in notes_to_archive:
            note_str = '<b>' + str(entry.timestamp) \
                       + ' - ' + str(entry.period) \
                       + ' - ' + str(entry.client.first_name)\
                       + ' - ' + str(entry.staff)\
                       + '</b><br/>'
            note_str += '<b>Notes:</b> ' + str(entry.notes) + '<br/>'
            headers = json.loads(entry.headers)
            raw_data = json.loads(entry.raw_data)
            for index, header in enumerate(headers):
                note_str += header + '<b>:</b><br/>'
                if index < len(raw_data):
                    note_str += raw_data[index] + '<br/>'

            Story.append(Paragraph(note_str, styles["Bullet"]))

        doc.build(Story)

        email = EmailMessage(
            'Subject here', 'Here is the message.', 'aajenkinssd@gmail.com', ['aajenkinssd@gmail.com'])
        email.attach_file("archived_report.pdf")
        email.send()
