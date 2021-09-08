const express = require("express");
const Experience = require("../models/experienceModel");

const experienceRouter = express.Router();

experienceRouter.route("/")
// get all
.get((req, res, next) => {
    Experience.find()
    .then(experiences => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(experiences);
    })
    .catch(err => next(err));
})

// create new experience
.post((req, res, next) => {
    Experience.create(req.body)
    .then(experience => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(experience);
    })
    .catch(err => next(err));
})

// update all not allowed
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operations not supported on /experiences");
})
.delete((req, res) => {
    Experience.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
});

// get experience by id
experienceRouter.route("/:experienceId")
.get((req, res, next) => {
    Experience.findById(req.params.experienceId)
    .then(experience => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(experience);
    })
    .catch(err => next(err));
})

// create not allowed in this path
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /experiences/${req.params.experienceId}`);
})

// update by id
.put((req, res, next) => {
    Experience.findByIdAndUpdate(req.params.experienceId,
        { $set: req.body },
        { new:true }
    )
    .then(experience => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(experience);
    })
    .catch(err => next(err));
})

// delete by id
.delete((req, res, next) => {
    Experience.findByIdAndDelete(req.params.experienceId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = experienceRouter;