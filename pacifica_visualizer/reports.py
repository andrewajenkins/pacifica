from __future__ import print_function

from datetime import datetime
import os.path
import re
from google.oauth2 import service_account
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

from pacifica_visualizer.models import Client


def get_abcs():
    scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
    secret_file = os.path.join(os.getcwd(), 'client_secret.json')

    credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=scopes)

    service = build('sheets', 'v4', credentials=credentials)

    sheet = service.spreadsheets()
    reports = []
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
        for report in client_values:
            print("length:" + str(len(report)))
            print(report)
            report_dict = {
                "timestamp": report[timestamp_index].split(" ")[0],
                "client": client.first_name,
                "staff": report[staff_index],
                "duration": report[duration_index],
                "place": report[place_index],
                "antecedent": report[antece_index],
                "behavior": report[behavior_index],
                "consequence": report[consequence_index],
            }
            if 9 < len(report):
                report_dict["ipp"] = report[ipp_index]
            if notes_index < len(report):
                report_dict["notes"] = report[notes_index]
                report_dict["abbr_notes"] = report[notes_index][:100]

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

    for entry in rejects:
        print(entry)

    sorted_reports = sorted(reports, key=lambda x: datetime.strptime(x['timestamp'], '%m/%d/%Y'), reverse=True)
    all_reports = sorted_reports + rejects
    for i in all_reports:
        print(i)

    return all_reports


def get_range(start, end):
    return "2021!A"+str(start)+":Z"+str(end)