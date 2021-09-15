const express = require("express");
const Experience = require("../models/experienceModel");
const authenticate = require("../authenticate");
const cors = require("./cors"); // cors module

const experienceRouter = express.Router();

experienceRouter.route("/")
// preflight request
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// get all
.get(cors.cors, (req, res, next) => {
    Experience.find()
    .populate("comments.author")
    .then(experiences => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(experiences);
    })
    .catch(err => next(err));
})
// create new experience
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Experience.create(req.body)
    .then(experience => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(experience);
    })
    .catch(err => next(err));
})
// update all not allowed
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operations not supported on /experiences");
})
// delete all experiences
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
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
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Experience.findById(req.params.experienceId)
    .populate("comments.author")
    .then(experience => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(experience);
    })
    .catch(err => next(err));
})
// create not allowed in this path
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /experiences/${req.params.experienceId}`);
})
// update by id
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
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
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Experience.findByIdAndDelete(req.params.experienceId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
    })
    .catch(err => next(err));
});

//
// COMMENTS
//

experienceRouter.route('/:experienceId/comments')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// get all comments by experienceId
.get(cors.cors, (req, res, next) => {
    Experience.findById(req.params.experienceId)
    .populate("comments.author")
    .then(experience => {
        if (experience) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(experience.comments)
        } else {
            err = new Error(`Experience ${req.params.experienceId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
// create new comment in experienceId
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Experience.findById(req.params.experienceId)
    .then(experience => {
        if(experience) {
            req.body.author = req.user._id;
            experience.comments.push(req.body);
            experience.save()
            .then(experience => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(experience);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Experience ${req.params.experienceId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
// update all comments not allowed
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /api/v1/experiences/
        ${req.params.experienceId}/comments`
    );
})
// delete all comments by experienceId
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Experience.findById(req.params.experienceId)
    .then(experience => {
        if (experience) {
            for (let i = (experience.comments.length-1); i>= 0; i--) {
                experience.comments.id(experience.comments[i]._id).remove();
            }
            experience.save()
            .then(experience => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(experience);
            })
            .catch(err => next(err));
        } else {
            err = new Error(`Experience ${req.params.experienceId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

//
// COMMENT ID
//

experienceRouter.route("/:experienceId/comments/:commentId")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
// get commentId by experienceId
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Experience.findById(req.params.experienceId)
    .populate("comments.author")
    .then(experience => {
        if(experience && experience.comments.id(req.params.commentId)) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(experience.comments.id(req.params.commentId));
        } else if (!experience) {
            err = new Error(`Location ${req.params.experienceId} not found`);
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
// create new comment in experienceId not allowed
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on
        /api/v1/experiences/${req.params.experienceId}/comments/${req.params.commentId}`
    );
})
// update commentId
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Experience.findById(req.params.experienceId)
    .then(experience => {
        if(experience && experience.comments.id(req.params.commentId)) {
            if ((experience.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
                if (req.body.rating) {
                    experience.comments.id(req.params.commentId).rating = req.body.rating;
                }
                if (req.body.text) {
                    experience.comments.id(req.params.commentId).text = req.body.text;
                }
                experience.save()
                .then(experience => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(experience);
                })
                .catch(err => next(err));
            } else {
                err = new Error("you are not authorized");
                err.status = 403;
                return next(err);
            }
        } else if (!experience) {
            err = new Error(`Location ${req.params.experienceId} not found`);
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

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Experience.findById(req.params.experienceId)
    .then(experience => {
        if ((experience.comments.id(req.params.commentId).author._id).equals(req.user._id)) {
            if(experience && experience.comments.id(req.params.commentId)) {
                experience.comments.id(req.params.commentId).remove();
                experience.save()
                .then(experience => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(experience);
                })
                .catch(err => next(err));
            } else {
                err = new Error("you are not authorized");
                err.status = 403;
                return next(err);
            }
        } else if (!experience) {
            err = new Error(`Location ${req.params.experienceId} not found`);
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


module.exports = experienceRouter;

