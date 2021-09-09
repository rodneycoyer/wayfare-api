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
// delete all experiences
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

//
// COMMENTS
//

experienceRouter.route('/:experienceId/comments')
// get all comments by experienceId
.get((req, res, next) => {
    Experience.findById(req.params.experienceId)
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
.post((req, res, next) => {
    Experience.findById(req.params.experienceId)
    .then(experience => {
        if(experience) {
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
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /api/v1/experiences/
        ${req.params.experienceId}/comments`
    );
})
// delete all comments by experienceId
.delete((req, res, next) => {
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
// get commentId by experienceId
.get((req, res, next) => {
    Experience.findById(req.params.experienceId)
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
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on
        /api/v1/experiences/${req.params.experienceId}/comments/${req.params.commentId}`
    );
})
// update commentId
.put((req, res, next) => {
    Experience.findById(req.params.experienceId)
    .then(experience => {
        if(experience && experience.comments.id(req.params.commentId)) {
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

.delete((req, res, next) => {
    Experience.findById(req.params.experienceId)
    .then(experience => {
        if(experience && experience.comments.id(req.params.commentId)) {
            experience.comments.id(req.params.commentId).remove();
            experience.save()
            .then(experience => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(experience);
            })
            .catch(err => next(err));
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

