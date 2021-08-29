from __future__ import print_function
import os.path

from google.oauth2 import service_account
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials

HUNTER_AM_NOTES = '1Zn0B61zvCPoPELwvUa0TxCV4Qf12GHN7pUWzCM8_ThI'
HUNTER_ABCS = '14N93DZhXoDcyl_hJthuRv_gU4xb1ZCRPLYgRr-rUoIE'

def get_sheet_detail():
    # If modifying these scopes, delete the file token.json.
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

    # The ID and range of a sample spreadsheet.
    SAMPLE_RANGE_NAME = '2021!A1:T113'
    secret_file = os.path.join(os.getcwd(), 'client_secret.json')

    credentials = service_account.Credentials.from_service_account_file(secret_file, scopes=SCOPES)

    service = build('sheets', 'v4', credentials=credentials)

    # Call the Sheets API
    sheet = service.spreadsheets()
    values = []
    for i in range(0, 30):
        new_sheet_range = get_range(i*10+1, (i*10)+10)
        print("getting new_sheet_range " + new_sheet_range)
        result = sheet.values().get(spreadsheetId=HUNTER_ABCS,
                                    range=new_sheet_range).execute()
        print("results:")
        print(result)
        if 'values' in result:
            values = values + result.get('values', [])
        else:
            print("Failed to find any more values")
            break

    if not values:
        print('No data found.')
    else:
        # print('Name, Major:')
        # for row in values:
        #     # Print columns A and E, which correspond to indices 0 and 4.
        #     print('%s, %s' % (row[0], row[4]))
        print("values:")
        print(values[0])

    return values;


def get_range(start, end):
    return "2021!A"+str(start)+":Z"+str(end)