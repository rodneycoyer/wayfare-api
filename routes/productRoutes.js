const express = require("express");
// express.router
const productRouter = express.Router();

productRouter.route("/")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res) => {
    res.end("will send all products");
})
.post((req, res) => {
    res.end(`Will add the product : ${req.body.name} with description : ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /products")
})
.delete((req, res) => {
    res.end("Deleting all products");
});

productRouter.route("/:productID")
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    next();
})
.get((req, res) => {
    res.end(`Sending details for product : ${req.params.productID}`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /products/${req.params.productID}`);
})
.put((req, res) => {
    res.write(`Updating product : ${req.params.productID}\n`);
    res.end(`Will update product : ${req.body.name}
        with description of : ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting product : ${req.params.productID}`);
});

module.exports = productRouter;