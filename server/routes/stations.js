const { debug, getStationID } = require("../modules/misc.js");
const { validateApiKey } = require("../modules/security");

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
}