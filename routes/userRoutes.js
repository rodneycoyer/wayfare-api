const express = require("express");
const User = require("../models/userModel");

const userRouter = express.Router();

userRouter.route("/")
// get all users
.get((req, res, next) => {
    User.find()
    .then(users => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
    })
    .catch(err => next(err));
})
// create new user
.post((req, res, next) => {
    User.create(req.body)
    .then(user => {
        console.log("New User Created", user);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
    })
    .catch(err => next(err));
})
// update all not allowed
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /users");
})
// delete all users
.delete((req, res, next) => {
    User.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
});


userRouter.route("/:userId")
// get user by id
.get((req, res, next) => {
    User.findById(req.params.userId)
    .then(user => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
    })
    .catch(err => next(err));
})
// POST not allowed in this route
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operations not supported for /users/${req.params.userId}`);
})
// update user by id
.put((req, res, next) => {
    User.findByIdAndUpdate(req.params.userId,
        {$set: req.body},
        {new: true}
    )
    .then(user => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(user);
    })
    .catch(err => next(err));
})
// delete user by id
.delete((req, res, next) => {
    User.findByIdAndDelete(req.params.userId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = userRouter;