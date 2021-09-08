const express = require("express");
// express router
const experienceRouter = express.Router();

experienceRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res) => {
    res.end("Sending all experiences your way");
})
.post((req, res) => {
    res.end(`Will add the experience : ${req.body.name} with description of : ${req.body.description}`)
})
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operations not supported on /experiences");
})
.delete((req, res) => {
    res.end("Deleting all experiences");
});

experienceRouter.route("/:experienceID")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res) => {
    res.end(`Sending details of experience: ${req.params.experienceID} shortly`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /experiences/${req.params.experienceID}`);
})
.put((req, res) => {
    res.write(`Updating experience : ${req.params.experienceID}\n`);
    res.end(`Will update : ${req.body.name}
        with description of : ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting experience : ${req.params.experienceID}`);
});

module.exports = experienceRouter;