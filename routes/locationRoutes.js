const express = require("express");
const locationRouter = express.Router();

locationRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res) => {
    res.end("Will send all locations to you");
})
.post((req, res) => {
    res.end(`Will add the location : ${req.body.name} with description ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /locations");
})
.delete((req, res) => {
    res.end("Deleting ALL locations");
});

// locationID stored in req.params.locationID
locationRouter.route("/:locationID")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res) => {
    res.end(`Will send details of location : ${req.params.locationID}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /locations/${req.params.locationID}`);
})
.put((req, res) => {
    res.write(`Updating location : ${req.params.locationID}\n`);
    res.end(`Will update location : ${req.body.name}
        with description : ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting location : ${req.params.locationID}`);
});

module.exports = locationRouter;