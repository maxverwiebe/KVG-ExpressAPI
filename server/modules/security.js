const config = require("../../config.json");
const validApiKey = config.apiKey;

/**
 * Middleware to validate the API key provided in a request.
 * 
 * @function
 * @param {Object} req - The Express request object
 * @param {Object} res - The Express response object
 * @param {Function} next - The next function in the Express middleware chain
 */
 module.exports.validateApiKey = function(req, res, next) {
    const apiKey = req.header("X-API-KEY");

    if (!apiKey) {
        return res.status(401).json({ error: "Invalid API Key." });
    }

    if (apiKey !== validApiKey) {
        debug("ERROR", `Wrong API Key from ${req.ip}. Got: ${apiKey}`)
        return res.status(403).json({ error: "Invalid API Key." });
    }

    next();
}