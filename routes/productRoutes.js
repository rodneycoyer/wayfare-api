const express = require("express");
const Experience = require("../models/experienceModel");
const Product = require("../models/productModel");

const productRouter = express.Router();

productRouter.route("/")
// get all products
.get((req, res, next) => {
    Product.find()
    .then(products => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(products);
    })
    .catch(err => next(err));
})
// create new product
.post((req, res, next) => {
    Product.create(req.body)
    .then(product => {
        console.log("Product Created", product);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(product);
    })
    .catch(err => next(err));
})
// update all not allowed
.put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /products")
})
// delete all products
.delete((req, res, next) => {
    Experience.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
});

productRouter.route("/:productId")
// get product by id
.get((req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(product);
    })
    .catch(err => next(err));
})
// POST not allowed in this route
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /products/${req.params.productId}`);
})
// update product by id
.put((req, res, next) => {
    Product.findByIdAndUpdate(req.params.productId,
        {$set: req.body},
        {new: true}
    )
    .then(product => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(product);
    })
    .catch(err => next(err));
})
// delete product by id
.delete((req, res) => {
    Product.findByIdAndDelete(req.params.productId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response)
    })
    .catch(err => next(err));
});

module.exports = productRouter;