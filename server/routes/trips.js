const { debug, getStationID } = require("../modules/misc.js");
const { validateApiKey } = require("../modules/security");
const config = require("../../config.json");

const axios = require('axios');

module.exports = function(app){

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
    app.get('/trips/get_trip/:id', validateApiKey, async (req, res) => {
        let id = req.params.id;

        if (config.debugMode) {
            debug("INFO", `New request at: /trips/get_trip/${id} from ${req.ip}`)
        }

        axios.get(`hhttps://kvg-kiel.de/internetservice/services/tripInfo/tripPassages?tripId=${id}`)
            .then(response => {
                res.json(response.data.actual);
            })
            .catch(error => {
                console.log(error);
                res.send("Trip not found.", 404)
            });
    }); // WIP
}