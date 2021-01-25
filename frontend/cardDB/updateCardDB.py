import requests
import unidecode
import json

url = 'https://spreadsheets.google.com/feeds/list/11fW57D2_3gwOFWomWoEEozKOwKsGpYokwmIF_LIy_tY/oi3rxyc/public/values?alt=json'

response = requests.get(url)
response_dict = json.loads(response.text)


def prettifyGoogleSheetsJSON(data):
    newDict = {}
    for i,entry in enumerate(data['feed']['entry']):
        #if i>0: break
        card_id = entry['gsx$cardid']['$t']
        newDict[card_id] = {'sideA':{},'sideB':{}}
        for key,value in entry.items():
            if key[0:4] == 'gsx$':
                key = key[4:]
                val = unidecode.unidecode(value['$t'])
                if key[0:5] == 'sidea':
                    newDict[card_id]['sideA'][key[5:]] = val
                    if (key[5:] == 'name'):
                        newDict[card_id]['sideA']['printname'] = value['$t']
                elif key[0:5] == 'sideb':
                    newDict[card_id]['sideB'][key[5:]] = val
                    if (key[5:] == 'name'):
                        newDict[card_id]['sideB']['printname'] = value['$t']
                else:
                    newDict[card_id][key] = val
    return newDict

cleanDict = prettifyGoogleSheetsJSON(response_dict)
with open('playringsCardDB.json', 'w') as outfile:
        json.dump(cleanDict, outfile)
