const express = require("express");
const User = require("../models/userModel");

const userRouter = express.Router();

// get list of users
userRouter.get("/", function (res, res) {
    res.send('respond with list of users')
}),

// create new user
userRouter.post("/signup", (req, res, next) => {
    User.findOne({ username: req.body.username })
    .then(user => {
        if (user) {
            const err = Error(`User ${req.body.username} already exists`);
            err.status = 403;
            return next(err);
        } else {
            User.create({
                username: req.body.username,
                password: req.body.password
            })
            .then(user => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({ status: "registration successful", user: user });
            })
            .catch(err => next(err));
        }
    })
    .catch(err => next(err));
});

// user login
userRouter.post("/login", (req, res, next) => {
    if (!req.session.user) {
        const authHeader = req.headers.authorization;

        if (!authorization) {
            const err = new Error("You are not authenticated");
            res.setHeader('WWW-Authenticate', 'Basic');
            return next(err);
        }
        // split username and password from req.header
        const auth = Buffer.from(authHeader.split(" ")[1], "base64").toString().split(":");
        const username = auth[0];
        const password = auth[1];

        User.findOne({ username: username })
        .then(user => {
            if (!user) {
                const err = new Error(`User ${username} does not exist`);
                err.status = 401;
                return next(err);
            } else if (user.password !== password) {
                const err = new Error(`password is incorrect`);
                err.status = 401;
                return next(err);
            } else if (user.username === username && user.password === password) {
                req.session.user = "authenticated";
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/plain");
                res.end("you are authenticated")
            }
        })
        .catch(err => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("you are already authenticated");
    }
});

// logout
userRouter.get("/logout", (req, res, next) => {
    if (req.session) {
        res.session.destroy();
        res.clearCookie("session=id");
        res.redirect("/");
    } else {
        const err = new Error("you are not logged in");
        err.status = 401;
        return next(err);
    }
});


module.exports = userRouter;