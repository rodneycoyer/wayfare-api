const express = require("express");
const userRouter = express.Router();

userRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res) => {
    res.end("sending all users over shortly");
})
.post((req, res) => {
    res.end(`adding user : ${req.body.name} with description of : ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /users");
})
.delete((req, res) => {
    res.end("Deleting all users");
});

// userID stored in req.params.userID
userRouter.route("/:userID")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res) => {
    res.end(`getting details for user : ${req.params.userID}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operations not supported for /users/${req.params.userID}`);
})
.put((req, res) => {
    res.write(`Updating user : ${req.params.userID}\n`);
    res.end(`Updating details for user : ${req.body.name} with description of : ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting user : ${req.params.userID}`);
});

module.exports = userRouter;