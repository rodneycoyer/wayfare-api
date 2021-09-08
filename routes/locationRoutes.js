const express = require("express");
const { response } = require("../app");
const Location = require("../models/locationModel");

const locationRouter = express.Router();

locationRouter.route("/")
// get all
.get((req, res, next) => {
    Location.find()
    .then(locations => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(locations);
    })
    .catch(err => next(err));
})
// create new
.post((req, res, next) => {
    Location.create(req.body)
    .then(location => {
        console.log("Location Created ", location);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(location);
    })
    .catch(err => next(err));
})
// update not allowed
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /locations");
})
// delete all
.delete((req, res, next) => {
    Location.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
});


locationRouter.route("/:locationId")
// get by id
.get((req, res, next) => {
    Location.findById(req.params.locationId)
    .then(location => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(location);
    })
    .catch(err => next(err));
})
// POST not allowed in this route
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /locations/${req.params.locationId}`);
})
// update by id
.put((req, res, next) => {
    Location.findByIdAndUpdate(req.params.locationId, {
        $set: req.body
    }, { new: true })
    .then(location => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(location);
    })
    .catch(err => next(err));
})
// delete by id
.delete((req, res, next) => {
    Location.findByIdAndDelete(req.params.locationId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = locationRouter;