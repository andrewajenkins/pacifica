from __future__ import print_function

import logging
import json
import os.path
import re

from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

from pacifica_visualizer.models import Client, ABC, DailyNote

logger = logging.getLogger(__name__)

scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
secret_file = os.path.join(os.getcwd(), 'client_secret.json')


def get_abcs():

    credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)

    service = build('sheets', 'v4', credentials=credentials)

    sheet = service.spreadsheets()
    reports = []
    record_index = 0;
    for client in Client.objects.all():
        print(client.first_name)
        timestamp_index = 0
        staff_index = 0
        notes_index = 0
        duration_index = 0
        place_index = 0
        antece_index = 0
        behavior_index = 0
        consequence_index = 0
        ipp_index = 0
        client_values = []
        for i in range(0, 30):
            new_sheet_range = get_range(i*10+1, (i*10)+10)
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
            if 'Behavior' in entry:
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
            print("length:" + str(len(report)))
            print(report)
            report_dict = {
                "id": record_index,
                "timestamp": report[timestamp_index].split(" ")[0],
                "client": client.first_name,
                "staff": report[staff_index],
                "duration": report[duration_index],
                "place": report[place_index],
                "antecedent": report[antece_index],
                "behavior": report[behavior_index],
                "consequence": report[consequence_index],
            }
            record_index += 1
            if 9 < len(report):
                report_dict["ipp"] = report[ipp_index]
            if notes_index < len(report):
                report_dict["notes"] = report[notes_index]

            reports.append(report_dict)

    sorted_reports = sorted(reports, key=lambda x: datetime.strptime(x['timestamp'], '%m/%d/%Y'), reverse=True)
    all_reports = sorted_reports
    for i in all_reports:
        print(i)

    return all_reports


def get_daily():

    credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)

    service = build('sheets', 'v4', credentials=credentials)

    sheet = service.spreadsheets()
    reports = []
    for client in Client.objects.all():
        for id in [{ "ant": "AM", "notes_id": client.am_notes_id}, {"ant": "PM", "notes_id": client.pm_notes_id}]:
            print(client.first_name)
            timestamp_index = 0
            staff_index = 0
            notes_index = 0
            client_values = []
            for i in range(0, 2):
                new_sheet_range = get_range(i*100+1, (i*100)+100)
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
                print("length:" + str(len(report)))
                print(report)
                report_dict = {
                    "timestamp": report[timestamp_index].split(" ")[0],
                    "client": client.first_name,
                    "staff": report[staff_index],
                    "period": id['ant'],
                    "headers": header_row,
                    "raw_data": report
                }
                if notes_index < len(report):
                    report_dict["notes"] = report[notes_index]

                reports.append(report_dict)

    rejects = []
    for i, report in enumerate(reports):
        pattern = re.compile("^\d\/\d+\/[0-9]{4}")
        if not pattern.search(report['timestamp']):
            print("rejecting: " + report['timestamp'])
            rejects.append(report)
            reports.pop(i)
        else:
            print("passing: " + report['timestamp'])

    # for entry in rejects:
    #     print(entry)


    sorted_reports = sorted(reports, key=lambda x: datetime.strptime(x['timestamp'], '%m/%d/%Y'), reverse=True)
    all_reports = sorted_reports
    for i in all_reports:
        print(i)

    return all_reports


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
            print("length:" + str(len(report)))
            print(report)
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
                print("length:" + str(len(report)))
                print(report)
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


def get_range(start, end):
    return "2021!A"+str(start)+":Z"+str(end)