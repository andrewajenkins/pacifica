from __future__ import print_function

import io
import logging
import json
import os.path

from datetime import datetime, timedelta

from django.http import FileResponse
from google.oauth2 import service_account
from googleapiclient.discovery import build
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch


from pacifica_visualizer.models import Client, ABC, DailyNote

logger = logging.getLogger(__name__)

scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
secret_file = os.path.join(os.getcwd(), 'client_secret.json')


def update_abcs():

    credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)

    service = build('sheets', 'v4', credentials=credentials)

    sheet = service.spreadsheets()
    reports = []
    record_index = 0;
    for client in Client.objects.all():
        print(client.first_name)
        timestamp_index = 0
        staff_index = 0
        notes_index = None
        duration_index = 0
        place_index = 0
        antece_index = 0
        behavior_index = 0
        consequence_index = 0
        ipp_index = None
        client_values = []
        new_sheet_range = get_range(1, 500)
        print("getting new_sheet_range " + new_sheet_range)
        result = sheet.values().get(spreadsheetId=client.abcs_id,
                                    range=new_sheet_range).execute()

        if 'values' in result:
            client_values = client_values + result.get('values', [])
        else:
            print("Failed to find any more values")
            break

        for i, entry in enumerate(client_values[0]):
            print(i, entry)
            if 'name' in entry.lower():
                staff_index = i
            if 'Note' in entry:
                notes_index = i
            if 'duration' in entry.lower():
                duration_index = i
            if 'place' in entry.lower():
                place_index = i
            if 'antece' in entry.lower():
                antece_index = i
            if 'Behav' in entry:
                behavior_index = i
            if 'consequence' in entry.lower():
                consequence_index = i
            if 'ipp' in entry.lower():
                ipp_index = i

        header_row = client_values.pop(0)
        for index, report in enumerate(client_values):
            # print("length:" + str(len(report)))
            # print(report)
            try:
                my_timestamp = datetime.strptime(report[timestamp_index], "%m/%d/%Y %H:%M:%S")
            except ValueError:
                my_timestamp = datetime.strptime(report[timestamp_index], "%m/%d/%Y")
            abc, created = ABC.objects.get_or_create(
                timestamp=my_timestamp,
                client=client,
                staff=report[staff_index],
                duration=report[duration_index],
                place=report[place_index],
                antecedent=report[antece_index],
                behavior=report[behavior_index],
                consequence=report[consequence_index],
                ipp=report[ipp_index] if ipp_index and len(report) > ipp_index else None,
                notes=report[notes_index] if notes_index and len(report) > notes_index else None,
            )
            if created:
                logger.info(f"created abc: {abc}")
            else:
                logger.info(f"abc already exists: {abc}")


def update_dailies():

    credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)

    service = build('sheets', 'v4', credentials=credentials)

    sheet = service.spreadsheets()
    for client in Client.objects.all():
        for id in [{ "ant": "AM", "notes_id": client.am_notes_id}, {"ant": "PM", "notes_id": client.pm_notes_id}]:
            print(client.first_name)
            timestamp_index = 0
            staff_index = None
            notes_index = None
            client_values = []
            new_sheet_range = get_range(1, 1000)
            print("getting new_sheet_range " + new_sheet_range)
            result = sheet.values().get(spreadsheetId=id['notes_id'],
                                        range=new_sheet_range).execute()

            if 'values' in result:
                client_values = client_values + result.get('values', [])
            else:
                print("Failed to find any more values")
                break

            for i, entry in enumerate(client_values[0]):
                print(i, entry)
                if 'Staff' in entry:
                    staff_index = i
                if 'Notes' in entry:
                    notes_index = i

            header_row = client_values.pop(0)
            for report in client_values:
                # print("length:" + str(len(report)))
                # print(report)
                try:
                    my_timestamp = datetime.strptime(report[timestamp_index], "%m/%d/%Y %H:%M:%S")
                except ValueError:
                    pass
                if not my_timestamp:
                    try:
                        my_timestamp = datetime.strptime(report[timestamp_index], "%m/%d/%Y")
                    except ValueError:
                        pass
                if not my_timestamp:
                    try:
                        my_timestamp = datetime.strptime(report[timestamp_index+1], "%m/%d/%Y")
                    except ValueError:
                        pass

                if (datetime.now() - timedelta(days=90)) < my_timestamp:
                    note, created = DailyNote.objects.get_or_create(
                        timestamp=my_timestamp,
                        client=client,
                        staff=report[staff_index] if staff_index and len(report) > staff_index else None,
                        period=id['ant'],
                        notes=report[notes_index] if notes_index and len(report) > notes_index else None,
                        headers=json.dumps(header_row),
                        raw_data=json.dumps(report),
                    )
                    if created:
                        logger.info(f"created note: {note}")
                    else:
                        logger.info(f"note already exists: {note}")
                else:
                    logger.info(f"skipped note, too old! {my_timestamp}")


def archive_reports(delta_days):
    notes_to_archive = DailyNote.objects.filter(timestamp__gte=(datetime.now() - timedelta(days=int(delta_days))))
    for entry in notes_to_archive:
        logger.info(f"include entry {entry.timestamp}")
    logger.info(f"count: {notes_to_archive.count()}")

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=landscape(letter),
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
                   + ' - ' + str(entry.client.first_name) \
                   + ' - ' + str(entry.staff) \
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
    buffer.seek(0)
    logger.info("returning file")
    return FileResponse(buffer, as_attachment=True, filename="archived_report_"+str(datetime.now())+".pdf")


def get_range(start, end):
    return "2021!A"+str(start)+":Z"+str(end)