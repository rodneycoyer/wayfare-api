const express = require("express");
const Product = require("../models/productModel");
const authenticate = require("../authenticate");

const productRouter = express.Router();

productRouter.route("/")
// get all products
.get((req, res, next) => {
    Product.find()
    .populate("comments.author")
    .then(products => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(products);
    })
    .catch(err => next(err));
})
// create new product
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /products")
})
// delete all products
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Product.deleteMany()
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
});

// productId

productRouter.route("/:productId")
// list product by id
.get((req, res, next) => {
    Product.findById(req.params.productId)
    .populate("comments.author")
    .then(product => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(product);
    })
    .catch(err => next(err));
})
// POST not allowed in this route
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /products/${req.params.productId}`);
})
// update product by id
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    Product.findByIdAndDelete(req.params.productId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response)
    })
    .catch(err => next(err));
});

//
// COMMENTS
//

productRouter.route("/:productId/comments")
// get comments by productId
.get((req, res, next) => {
    Product.findById(req.params.productId)
    .populate("comments.author")
    .then(product => {
        if(product) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(product.comments);
        } else {
            err = new Error(`Location ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
// create new comment in productId
.post(authenticate.verifyUser, (req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(product) {
            req.body.author = req.user._id;
            product.comments.push(req.body);
            product.save()
            .then(product => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(product);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Location ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
// update all comments not allowed
.put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /api/v1/products/
        ${req.params.productId}/comments`
    );
})
// delete all comments in productId
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(product) {
            for (let i = (product.comments.length-1); i >= 0; i--) {
                product.comments.id(product.comments[i]._id).remove();
            }
            product.save()
            .then(product => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(product);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Location ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

//
// COMMENT ID
//

productRouter.route("/:productId/comments/:commentId")
// get commentId by productId
.get((req, res, next) => {
    Product.findById(req.params.productId)
    .populate("comments.author")
    .then(product => {
        if(product && product.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(product.comments.id(req.params.commentId));
        } else if (!product) {
            err = new Error(`Location ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
// create new comment comment in productId not allowed
.post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on
        /api/v1/products/${req.params.productId}/comments/${req.params.commentId}`
    );
})
// update commentId
.put(authenticate.verifyUser, (req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(product && product.comments.id(req.params.commentId)) {
            if ((product.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
                if (req.body.rating) {
                    product.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.text) {
                    product.comments.id(req.params.commentId).text = req.body.text;
                }
                product.save()
                .then(product => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(product);
                })
                .catch(err => next(err));
            } else {
                err = new Error("you are not authorized");
                err.status = 403;
                return next(err);
            }
        } else if (!product) {
            err = new Error(`Location ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
// delete commentId
.delete(authenticate.verifyUser, (req, res, next) => {
    Product.findById(req.params.productId)
    .then(product => {
        if ((product.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
            if(product && product.comments.id(req.params.commentId)) {
                product.comments.id(req.params.commentId).remove();
                product.save()
                .then(product => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(product);
                })
                .catch(err => next(err));
            } else {
                err = new Error("you are not authorized");
                err.status = 403;
                return next(err);
            }
        } else if (!product) {
            err = new Error(`Location ${req.params.productId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Comment ${req.params.commentId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});





module.exports = productRouter;