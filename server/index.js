/**
 * ---------------------------------------------
 *              KVG Bus Express API
 * ---------------------------------------------
 * 
 * Description:
 * This module initializes and manages the Express API server, handling incoming
 * requests, middleware configurations, and endpoint definitions.
 * 
 * Author: Maximilian Verwiebe
 * Created: 09.08.2023
 * 
 * Dependencies:
 * - express: web server framework
 * - fs: file system
 * - axios: handles http requests
 * 
 * Usage:
 * This file should be executed to start the API server. Typically run with `node server/index.js`.
 * ---------------------------------------------
 */


const config = require('../config.json')
const express = require('express')
const fs = require('fs');
const axios = require('axios');

const app = express()
const port = config.port;
const validApiKey = config.apiKey;
const debugMode = config.debugMode;

/**
 * Formats a number n into a string with two digits
 * 
 * @function
 * @param {Number} n - The number to format
 * @return {String} - The formatted number
 */
 const formatTwoDigits = (n) => {
    return n < 10 ? '0' + n : n; //condition ? expression1 : expression2; if condition then expression1 else expression2
}

/**
 * Prints a debug messages
 * 
 * @function
 * @param {String} type - The type, element of {"INFO", "ERROR"}
 * @param {String} message - The message to be printed
 */
const debug = (type, message) => {
    var currentdate = new Date(); 
    var hours = formatTwoDigits(currentdate.getHours());
    var minutes = formatTwoDigits(currentdate.getMinutes());
    var seconds = formatTwoDigits(currentdate.getSeconds());

    var color = "\x1b[36m%s\x1b[0m"

    let output = `${hours}:${minutes}:${seconds} `;

    if (type == "INFO") {
        output += "[*] "
    } else if (type == "ERROR") {
        output += "[ERROR] "
        color = "\x1b[31m"
    }

    output += message

    console.log(color, output)
}

const getStationID = async (name) => {
    // Den Inhalt der CSV-Datei holen
    const data = fs.readFileSync("./stopname_stopid_output.csv", "utf-8");
    //const data = await response.text();

    // Zeilenweise zerlegen
    const lines = data.split('\n');
    for (let i = 1; i < lines.length; i++) { // Beginn bei 1, um die Kopfzeile zu überspringen
        const [stopID, stopName] = lines[i].split(',');

        if (stopName && stopName.trim() === name.trim()) {
            return stopID;
        }
    }

    // Wenn nichts gefunden wurde
    return null;
}

/**
 * Middleware to validate the API key provided in a request.
 * 
 * @function
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next function in the Express middleware chain
 */
const validateApiKey = (req, res, next) => {
    const apiKey = req.header('X-API-KEY');

    if (!apiKey) {
        return res.status(401).json({ error: 'API Key fehlt' });
    }

    if (apiKey !== validApiKey) {
        debug("ERROR", `Wrong API Key from ${req.ip}. Got: ${apiKey}`)
        return res.status(403).json({ error: 'Ungültiger API Key' });
    }

    next();
}

/**
 * GET endpoint for '/request_kvg'.
 * 
 * Responses:
 * - 200 OK: JSON Object with information
 * - 401 Unauthorized: If the API key is missing
 * - 403 Forbidden: If the API key is invalid
 * 
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/request_kvg', validateApiKey, async (req, res) => {
    if (debugMode) {
        debug("INFO", "New request at: /request_kvg from " + req.ip)
    }
    res.json({ message: "Done!" });
}); // WIP

/**
 * GET endpoint for '/stations/get_departing_busses_from_station/:type/:id'.
 * 
 * Responses:
 * - 200 OK: JSON Object with information
 * - 401 Unauthorized: If the API key is missing
 * - 403 Forbidden: If the API key is invalid
 * 
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/stations/get_departing_busses_from_station/:type/:id', validateApiKey, async (req, res) => {
    const type = req.params.type;
    let id = req.params.id;

    if (debugMode) {
        debug("INFO", `New request at: /stations/get_departing_busses_from_station/${type}/${id} from ${req.ip}`)
    }

    if (type === "name") {
        try {
            id = await getStationID(id);
            //console.log("FOUND ID:", id);
        } catch (err) {
            debug("ERROR", "Error fetching station id... " + error)
            res.send("Error fetching station ID", 500);
            return;
        }
    } // else we expect name to be "id"

    axios.get(`https://www.kvg-kiel.de/internetservice/services/passageInfo/stopPassages/stop?stop=${id}&mode=departure`)
        .then(response => {
            //console.log(response.data.url);
            //console.log(response.data);
            res.json(response.data.actual);
        })
        .catch(error => {
            console.log(error);
            res.send("Bus station not found.", 404)
        });
}); // WIP

/**
 * GET endpoint for '/stations/get_busses_from_station/:type/:id'.
 * 
 * Responses:
 * - 200 OK: JSON Object with information
 * - 401 Unauthorized: If the API key is missing
 * - 403 Forbidden: If the API key is invalid
 * 
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
app.get('/stations/get_busses_from_station/:type/:id', validateApiKey, async (req, res) => {
    const type = req.params.type;
    let id = req.params.id;

    if (debugMode) {
        debug("INFO", `New request at: /stations/get_busses_from_station/${type}/${id} from ${req.ip}`)
    }

    if (type === "name") {
        try {
            id = await getStationID(id);
            //console.log("FOUND ID:", id);
        } catch (err) {
            debug("ERROR", "Error fetching station id... " + error)
            res.send("Error fetching station ID", 500);
            return;
        }
    } // else we expect name to be "id"

    axios.get(`https://www.kvg-kiel.de/internetservice/services/passageInfo/stopPassages/stop?stop=${id}&mode=departure`)
        .then(response => {
            //console.log(response.data.url);
            //console.log(response.data);
            res.json(response.data.routes);
        })
        .catch(error => {
            console.log(error);
            res.send("Bus station not found.", 404)
        });
}); // WIP

/**
 * Starts the Express server and listens on the specified port
 *
 * @function
 * @param {number} port - The port number on which the server listens
 */
app.listen(port, () => {

    if (debugMode) {
        debug("INFO", "Server started.")
    }

    console.log(`
        -----------------------------------------------
                    - Started API endpoint -
                    Listening at: ${port}
                    Key: ${validApiKey}
        -----------------------------------------------
    `)
})