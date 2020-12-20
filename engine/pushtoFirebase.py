import json
from firebase import firebase

firebase = firebase.FirebaseApplication('https://yourbubble-69f44-default-rtdb.firebaseio.com', None)


def riskScoreCalculator(squarefootage, buildingtype, FourteenDayPositiveCases, currentCount):
    if FourteenDayPositiveCases == 0:
        FourteenDayPositiveCases = 1
    if buildingtype == "Library":
        maxOccupancy = (squarefootage / 50)
    if buildingtype == "Park":
        maxOccupancy = (squarefootage / 10)
    if buildingtype == "Cafe":
        maxOccupancy = (squarefootage / 15)
    if buildingtype == "Gym":
        maxOccupancy = (squarefootage / 200)
    if buildingtype == "Dining Hall":
        maxOccupancy = (squarefootage / 15)
    riskScore = 10 - (10 / (currentCount * 4 / (maxOccupancy)) / (FourteenDayPositiveCases))

    if riskScore < 0:
        riskScore = 1 + FourteenDayPositiveCases / 5
    print(riskScore)
    return riskScore

def UIUCriskCalculation():
    with open('UIUCdata.json') as f:
        data = json.loads(f.read())
    for i in data["features"]:
        buildingType = i["properties"]["category"]
        buildingName = i["properties"]["name"]
        buildingCount = i["properties"]["currentCount"]
        buildingSqft = i["properties"]["sqft"]
        buildingCases = i["properties"]["positiveCases"]
        print(buildingType)
        riskscore = riskScoreCalculator(buildingSqft, buildingType, buildingCases, buildingCount)
        print(buildingName)
        result = firebase.patch('/buildings/uiuc/', {buildingName: str(round(riskscore))})


def AMHERSTriskCalculation():
    with open('Umassdata.json') as f:
        data = json.loads(f.read())
    for i in data["features"]:
        buildingType = i["properties"]["category"]
        buildingName = i["properties"]["name"]
        buildingCount = i["properties"]["currentCount"]
        buildingSqft = i["properties"]["sqft"]
        buildingCases = i["properties"]["positiveCases"]
        print(buildingType)
        riskscore = riskScoreCalculator(buildingSqft, buildingType, buildingCases, buildingCount)
        print(buildingName)
        result = firebase.patch('/buildings/umass/', {buildingName: str(round(riskscore))})
def RPIriskCalculation():
    with open('RPIdata.json') as f:
        data = json.loads(f.read())
    for i in data["features"]:
        buildingType = i["properties"]["category"]
        buildingName = i["properties"]["name"]
        buildingCount = i["properties"]["currentCount"]
        buildingSqft = i["properties"]["sqft"]
        buildingCases = i["properties"]["positiveCases"]
        print(buildingType)
        riskscore = riskScoreCalculator(buildingSqft, buildingType, buildingCases, buildingCount)
        print(buildingName)
        result = firebase.patch('/buildings/rpi/', {buildingName: str(round(riskscore))})
if __name__ == '__main__':
    RPIriskCalculation()
    UIUCriskCalculation()
    AMHERSTriskCalculation()