const axios = require('axios');
const fs = require('fs');

const baseURL = 'https://www.kvg-kiel.de/internetservice/services/passageInfo/stopPassages/stop?stop=';
const mode = '&mode=departure';

const fetchStopName = async (stopId) => {
    try {
        const response = await axios.get(baseURL + stopId + mode);
        console.log("FOUND at " + stopId)
        return response.data.stopName;
    } catch (error) {
        //console.error(`Error fetching data for STOPID: ${stopId}`, error);
        return null;
    }
};

const saveToCSV = async () => {
    let csvData = 'STOPID,stopName\n';
    for (let stopId = 1563; stopId <= 2000; stopId++) {
        const stopName = await fetchStopName(stopId);
        if (stopName) {
            csvData += `${stopId},${stopName}\n`;
        }
    }
    fs.writeFileSync('stopNames.csv', csvData);
};

saveToCSV();
