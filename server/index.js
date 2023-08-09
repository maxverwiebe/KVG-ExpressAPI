const config = require('../config.json')
const express = require('express')
const app = express()
const port = config.port;
const validApiKey = config.apiKey;
const debugMode = config.debugMode;

function formatTwoDigits(n) {
    return n < 10 ? '0' + n : n;
}

const debug = (type, message) => {
    var currentdate = new Date(); 
    var hours = formatTwoDigits(currentdate.getHours());
    var minutes = formatTwoDigits(currentdate.getMinutes());
    var seconds = formatTwoDigits(currentdate.getSeconds());

    let output = `${hours}:${minutes}:${seconds} `;

    if (type == "INFO") {
        output += "[*] "
    } else if (type == "ERROR") {
        output += "[ERROR] "
    }

    output += message

    console.log(output)
}

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

app.get('/request_kvg', validateApiKey, async (req, res) => {
    if (debugMode) {
        debug("INFO", "New request at: /request_kvg from " + req.ip)
    }
    res.json({ message: "Done!" });
});

app.listen(port, () => {
  console.log(`
    -----------------------------------------------
                - Started API endpoint -
                  Listening at: ${port}
                  Key: ${validApiKey}
    -----------------------------------------------
  `)
})