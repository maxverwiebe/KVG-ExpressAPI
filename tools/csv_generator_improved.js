/**
 * ---------------------------------------------
 *           KVG Stop Name Fetcher Module
 * ---------------------------------------------
 * 
 * Retrieves stop names from the KVG API and saves the data in CSV format.
 * This is needed to know which stopNameID belongs to which stopName.
 * 
 * Dependencies:
 * - axios: Used for HTTP requests
 * - fs: For writing data to a file
 * 
 * Configuration:
 * - baseURL: Base URL for the API requests.
 * - mode: Request mode (departure).
 * - concurrentRequests: Number of simultaneous requests to the API.
 * 
 * Functions:
 * - fetchStopName(stopId): Retrieves the stop name for a given stop ID.
 * - formatStopName(stopName): Formats the stop name for CSV storage.
 * - saveToCSV(): Saves all fetched stop names in a CSV file.
 * 
 * Execution:
 * On module start, the saveToCSV() function is invoked to fetch and store data.
 * ---------------------------------------------
 */
 const axios = require('axios');
 const fs = require('fs');

const axios = require('axios');
const fs = require('fs');

const baseURL = 'https://www.kvg-kiel.de/internetservice/services/passageInfo/stopPassages/stop?stop=';
const mode = '&mode=departure';

const concurrentRequests = 100;

const fetchStopName = async (stopId) => {
    try {
        const response = await axios.get(baseURL + stopId + mode);
        console.log("Found something at " + stopId)
        return {
            stopId,
            stopName: response.data.stopName
        };
    } catch (error) {
        //console.error(`Error fetching data for STOPID: ${stopId}`, error);
        return null;
    }
};

// WIP
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
