import time
from datetime import datetime
import requests
import os
import json 


API_KEY = "AAN-2D9-ZFV-23O-8SH"

class KVGAnalyzer():
    def __init__(self, updateFrequency, endTime):
        self.updateFrequency = updateFrequency #in seconds
        self.endTime = endTime #in seconds

        self._currentTime = 0 #internal use
        self._results = []

        self._startedAt = KVGAnalyzer._getTimestamp_()

    @staticmethod
    def _getTimestamp_():
        timestamp = time.time()
        dt_object = datetime.fromtimestamp(timestamp)
        return dt_object.strftime('%d_%m_%Y-%H_%M')

    def _addResult_(self, msg, fileMode = False, printMode = True):
        if fileMode:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            file_path = os.path.join(current_dir, f"results/{self._startedAt}.txt")
            
            with open(file_path, "a") as f:
                f.write(msg + "\n")
            return
       
        if printMode:
            print(msg)

    @staticmethod
    def timestringToSecs(timeStr):
        hours, minutes = map(int, timeStr.split(":"))
        return hours * 3600 + minutes * 60

    def analyzeDelayAtStop(self, config):
        if not config["stopType"] or not config["stopIdent"]:
            print("ERROR")
            return

        self._addResult_(f"Starting the analysis of delays at a stop.")

        self._addResult_(f"Start: {KVGAnalyzer._getTimestamp_()}", True, False)
        self._addResult_(f"Duration: {self.endTime}s", True, False)

        # make sure station was found
        testreq = requests.get(f"http://localhost:3000/stations/get_departing_busses_from_station/{config['stopType']}/{config['stopIdent']}", headers={"X-API-KEY": API_KEY})
        if testreq.status_code != 200:
            self._addResult_("An error occured while trying to connect to the API:", True, True)
            self._addResult_(str(testreq.status_code) + " - " + testreq.reason, True, True)
            self._addResult_(testreq.content, True, True)
            self._addResult_(f"Terminating at {KVGAnalyzer._getTimestamp_()}", True, True)
            return

        self._cache = {}
        self._cache["busses"] = {}

        while self._currentTime <= self.endTime:
            req = requests.get(f"http://localhost:3000/stations/get_departing_busses_from_station/{config['stopType']}/{config['stopIdent']}", headers={"X-API-KEY": API_KEY})
            if req.status_code != 200:
                self._addResult_("An error occured while trying to connect to the API:", True, True)
                self._addResult_(str(req.status_code) + " - " + req.reason, True, True)
                self._addResult_(req.content, True, True)
                self._addResult_(f"Terminating at {KVGAnalyzer._getTimestamp_()}", True, True)
                return

            result = req.json()

            for data in result:
                plannedTime = KVGAnalyzer.timestringToSecs(data["plannedTime"])
                actualTime = 0

                if "actualTime" in data:
                    actualTime = KVGAnalyzer.timestringToSecs(data["actualTime"])
                elif "mixedTime" in data:
                    actualTime = KVGAnalyzer.timestringToSecs(data["mixedTime"])
                else:
                    actualTime = plannedTime

                difference = actualTime - plannedTime #alias delay in seconds

                cacheData = {
                    "direction": data['direction'],
                    "plannedTime": data['plannedTime'],
                    "patternText": data['patternText'],
                    "delay": difference,
                }

                self._cache["busses"][data['tripId']] = cacheData

                #print(f"TripID: {data['tripId']} Bus: {data['patternText']} -> {data['direction']} Delay: {difference}s")

            self._currentTime += self.updateFrequency
            time.sleep(self.updateFrequency)
        
        self._addResult_(f"End of the analysis. It ran for {str(round(self.endTime / 3600, 2))} hours (or {self.endTime}s).")

        tripData = self._cache['busses'] #save a reference for easier access

        ###### Analysis of count
        self._addResult_(f"{len(tripData)} have been registered by the system during that time.")

        ###### Get average delay
        sumOfDelays = 0
        delayArray = []

        for tripId in tripData:
            sumOfDelays += tripData[tripId]["delay"]
            delayArray.append(tripData[tripId]["delay"])

        avg = sumOfDelays / len(tripData)
        self._addResult_(f"Average delay: {str(avg)}s")

        ###### Get median
        delayArray.sort()
        self._addResult_(f"Median delay: {str(delayArray[len(delayArray)//2])}s")

        ###### Get hour with max avg delay
        delayData = {}

        for _, value in tripData.items():
            hour = int(value['plannedTime'].split(':')[0]) # extracting the hour of the plannedTime string
            delay = value['delay']
            
            if hour not in delayData:
                delayData[hour] = {'sum': 0, 'count': 0}
            
            delayData[hour]['sum'] += delay
            delayData[hour]['count'] += 1

        averageDelays = {}
        for hour, data in delayData.items():
            averageDelays[hour] = data['sum'] / data['count']

        max_hour = max(averageDelays, key=averageDelays.get)

        self._addResult_(f"The hour with the highest max avg is {max_hour} O'Clock with an average delay of {averageDelays[max_hour]}s.")
        self._addResult_(f"Terminating at {KVGAnalyzer._getTimestamp_()}", True, True)

        current_dir = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_dir, f"results/{self._startedAt}_RAW.json")
            
        with open(file_path, "a") as f:
            f.write(json.dumps(tripData, indent=4))
        return


c = KVGAnalyzer(5, 60*30)
c.analyzeDelayAtStop({
    "stopType": "name",
    "stopIdent": "hauptbahnhof" # todo: add caching to the api
})