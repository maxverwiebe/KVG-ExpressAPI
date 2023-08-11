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
 * ---------------------------------------------
 */

const axios = require('axios');
const fs = require('fs');

const baseURL = 'https://www.kvg-kiel.de/internetservice/services/passageInfo/stopPassages/stop?stop=';
const mode = '&mode=departure';

const concurrentRequests = 100;

const fetchStopName = async (stopId) => {
    try {
        const response = await axios.get(baseURL + stopId + mode);
        console.log("\x1b[90m", "Found something at " + stopId)
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
    stopName = stopName.replace(/[^a-z0-9äöüß]+/gi, '-'); //replaces every non-alphanumeric number by "-" but keeps every "äöü"
    stopName = stopName.replace(/-{2,}/g, '-'); //replaces multiple occurencces of "-" by a single "-" 
    stopName = stopName.toLowerCase();

    return stopName
}

const saveToCSV = async () => {
    console.log("\x1b[32m", "Successfully started the generator.")

    let csvData = 'stopid,stopname\n';

    for (let i = 1; i <= 10000; i += concurrentRequests) {
        const promises = [];
        for (let j = 1; j < concurrentRequests && i + j <= 5000; j++) {
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

    console.log("\x1b[32m", "Finished the search.")
    fs.writeFileSync('stopname_stopid_output.csv', csvData)
    console.log("\x1b[32m", "Successfully saved the output.")
};

saveToCSV();
