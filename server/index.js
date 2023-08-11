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

const { debug, getStationID } = require("./modules/misc");
const { validateApiKey } = require("./modules/security");
require('./routes/stations')(app);

const port = config.port;
const validApiKey = config.apiKey;
const debugMode = config.debugMode;

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