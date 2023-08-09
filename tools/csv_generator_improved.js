const axios = require('axios');
const fs = require('fs');

const baseURL = 'https://www.kvg-kiel.de/internetservice/services/passageInfo/stopPassages/stop?stop=';
const mode = '&mode=departure';

const concurrentRequests = 100; // Gleichzeitige Anfragen

const fetchStopName = async (stopId) => {
    try {
        const response = await axios.get(baseURL + stopId + mode);
        console.log("FOUND at " + stopId)
        return {
            stopId,
            stopName: response.data.stopName
        };
    } catch (error) {
        //console.error(`Error fetching data for STOPID: ${stopId}`, error);
        return null;
    }
};

const formatStopName = (stopName) => {
    stopName = stopName.replace(" ", "-");
    stopName = stopName.replace(",", "").toLowerCase();

    return stopName
}

const saveToCSV = async () => {
    let csvData = 'STOPID,stopName\n';

    for (let i = 1000; i <= 2000; i += concurrentRequests) {
        const promises = [];
        for (let j = 0; j < concurrentRequests && i + j <= 10000; j++) {
            promises.push(fetchStopName(i + j));
        }
        
        const results = await Promise.all(promises);
        for (const result of results) {
            if (result && result.stopId && result.stopName) {
                const stopName = formatStopName(result.stopName);
                csvData += `${result.stopId},${stopName}\n`;
            }
        }
    }

    fs.writeFileSync('stopNames.csv', csvData);
};

saveToCSV();
