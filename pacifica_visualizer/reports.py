from __future__ import print_function

import io
import logging
import json
import os.path
import threading

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
        # print(client.first_name)
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
        # print("getting new_sheet_range " + new_sheet_range)
        result = sheet.values().get(spreadsheetId=client.abcs_id,
                                    range=new_sheet_range).execute()

        if 'values' in result:
            client_values = client_values + result.get('values', [])
        else:
            print("Failed to find any more values")
            break

        for i, entry in enumerate(client_values[0]):
            # print(i, entry)
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
                try:
                    my_timestamp = datetime.strptime(report[timestamp_index], "%m/%d/%Y")
                except ValueError:
                    try:
                        my_timestamp = datetime.strptime(report[timestamp_index+1], "%m/%d/%y")
                    except ValueError:
                        print(report)
                        report[timestamp_index] = datetime.now()
                        my_timestamp = str(report[timestamp_index])

            abc, created = ABC.objects.update_or_create(
                client=client,
                staff=report[staff_index],
                behavior=report[behavior_index],
                defaults={
                    "timestamp": my_timestamp,
                    "duration": report[duration_index],
                    "place": report[place_index],
                    "antecedent": report[antece_index],
                    "consequence": report[consequence_index],
                    "ipp": report[ipp_index] if ipp_index and len(report) > ipp_index else None,
                    "notes": report[notes_index] if notes_index and len(report) > notes_index else None,
                }
            )
            # if created:
            #     logger.info(f"created abc: {abc}")
            # else:
            #     logger.info(f"abc already exists: {abc}")


def update_dailies(start_time_total):
    # credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)
    #
    # service = build('sheets', 'v4', credentials=credentials)
    #
    # sheet = service.spreadsheets()
    threads = []
    notes_to_add = []
    note_map = {}
    map_time = datetime.now()
    notes = DailyNote.objects.all()
    for note in notes:
        note_map[note_hash(note)] = note
    logger.info(f"map time: {datetime.now() - map_time}")
    logger.info(f"note_map COUNT: {len(note_map)}")
    # for entry in
    # {
    #     'timestamp': self.timestamp,
    #     'client': self.client.first_name,
    #     'staff': self.staff,
    #     'period': self.period,
    #     'notes': self.notes,
    # }
    for client in Client.objects.all():
        for id in [{ "ant": "AM", "notes_id": client.am_notes_id}, {"ant": "PM", "notes_id": client.pm_notes_id}]:

            threads.append(threading.Thread(target=get_data,
                                            kwargs=({
                                                # 'credentials': credentials,
                                                'id': id,
                                                'client': client,
                                                'notes_to_add': notes_to_add,
                                                'note_map': note_map,
                                            }),
                                            daemon=True))

    # start_time_read = datetime.now()
            # # print(client.first_name)
            # timestamp_index = 0
            # staff_index = None
            # notes_index = None
            # client_values = []
            # new_sheet_range = get_range(1, 1000)
            # # print("getting new_sheet_range " + new_sheet_range)
            # result = sheet.values().get(spreadsheetId=id['notes_id'],
            #                             range=new_sheet_range).execute()
            #
            # if 'values' in result:
            #     client_values = client_values + result.get('values', [])
            # else:
            #     print("Failed to find any more values")
            #     break
            #
            # for i, entry in enumerate(client_values[0]):
            #     # print(i, entry)
            #     if 'Staff' in entry:
            #         staff_index = i
            #     if 'Notes' in entry:
            #         notes_index = i
            #
            # logger.info(f"read time: {datetime.now() - start_time_read}")
            # start_time_parse = datetime.now()
            # header_row = client_values.pop(0)
            # for report in client_values:
            #     # print("length:" + str(len(report)))
            #     # print(report)
            #     try:
            #         my_timestamp = datetime.strptime(report[timestamp_index], "%m/%d/%Y %H:%M:%S")
            #     except ValueError:
            #         pass
            #     if not my_timestamp:
            #         try:
            #             my_timestamp = datetime.strptime(report[timestamp_index], "%m/%d/%Y")
            #         except ValueError:
            #             pass
            #     if not my_timestamp:
            #         try:
            #             my_timestamp = datetime.strptime(report[timestamp_index+1], "%m/%d/%Y")
            #         except ValueError:
            #             pass
            #
            #     if (datetime.now() - timedelta(days=90)) < my_timestamp:
            #         try:
            #             note, created = DailyNote.objects.get_or_create(
            #                 timestamp=my_timestamp,
            #                 client=client,
            #                 staff=report[staff_index] if staff_index and len(report) > staff_index else None,
            #                 period=id['ant'],
            #                 notes=report[notes_index] if notes_index and len(report) > notes_index else None,
            #                 headers=json.dumps(header_row),
            #                 raw_data=json.dumps(report),
            #             )
            #         except (IntegrityError, MultipleObjectsReturned):
            #             pass
            #
            # logger.info(f"parse time: {datetime.now() - start_time_parse}")
    thread_start = datetime.now()
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    logger.info(f"thread time: {datetime.now() - thread_start}")
    logger.info(f"notes_to_add COUNT: {len(notes_to_add)}")

    bulk_start = datetime.now()
    DailyNote.objects.bulk_create(notes_to_add)
    logger.info(f"bulk create time: {datetime.now() - bulk_start}")

    logger.info(f"total time: {datetime.now() - start_time_total}")

                #     if created:
                #         logger.info(f"created note: {note}")
                #     else:
                #         logger.info(f"note already exists: {note}")
                # else:
                #     logger.info(f"skipped note, too old! {my_timestamp}")

def get_data(**kwargs):
    debug = False
    if debug: print(kwargs)
    id = kwargs['id']
    # sheet = kwargs['sheet']
    # credentials = kwargs['credentials']
    client = kwargs['client']
    notes_to_add = kwargs['notes_to_add']
    note_map = kwargs['note_map']
    start_time_read = datetime.now()
    init_start = datetime.now()
    credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)

    service = build('sheets', 'v4', credentials=credentials)

    sheet = service.spreadsheets()
    logger.info(f"init time: {datetime.now() - init_start}")
    if debug: print(client.first_name)
    timestamp_index = 0
    staff_index = None
    notes_index = None
    client_values = []
    new_sheet_range = get_range(1, 1000)
    if debug: print("getting new_sheet_range " + new_sheet_range)
    result = sheet.values().get(spreadsheetId=id['notes_id'],
                                range=new_sheet_range).execute()

    if 'values' in result:
        client_values = client_values + result.get('values', [])
    else:
        print("Failed to find any more values")
        return

    for i, entry in enumerate(client_values[0]):
        if debug: print(i, entry)
        if 'Staff' in entry:
            staff_index = i
        if 'Notes' in entry:
            notes_index = i

    logger.info(f"read time: {datetime.now() - start_time_read}")
    start_time_parse = datetime.now()
    header_row = client_values.pop(0)
    for report in client_values:
        if debug: print("length:" + str(len(report)))
        if debug: print(report)
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
                my_timestamp = datetime.strptime(report[timestamp_index + 1], "%m/%d/%Y")
            except ValueError:
                pass

        if (datetime.now() - timedelta(days=90)) < my_timestamp:
            note = DailyNote(
                timestamp=my_timestamp,
                client=client,
                staff=report[staff_index] if staff_index and len(report) > staff_index else None,
                period=id['ant'],
                notes=report[notes_index] if notes_index and len(report) > notes_index else None,
                headers=json.dumps(header_row),
                raw_data=json.dumps(report),
            )
            if note_hash(note) not in note_map:
                notes_to_add.append(note)


    logger.info(f"parse time: {datetime.now() - start_time_parse}")


def archive_reports(delta_days):
    notes_to_archive = DailyNote.objects.filter(timestamp__gte=(datetime.now() - timedelta(days=int(delta_days))))
    # for entry in notes_to_archive:
    #     logger.info(f"include entry {entry.timestamp}")
    # logger.info(f"count: {notes_to_archive.count()}")

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


def note_hash(self):
    return hash(
        str(self.timestamp) if self.timestamp else ""
        + self.client.first_name
        + self.staff
        + self.period
        + self.notes
    )


def get_range(start, end):
    return "2021!A"+str(start)+":Z"+str(end)