const express = require("express");
const authenticate = require("../authenticate");
const multer = require("multer");
const uploadRouter = express.Router();

// multer disk storage
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "public/images");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname)
    }
});

// check image file types
const imageFileFilter = (req, file, callback) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('image file type required.'), false);
    }
    callback(null, true);
};

// upload
const upload = multer({ storage: storage, fileFilter: imageFileFilter});

uploadRouter.route("/")
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /imageUpload");
})

.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single("imageFile"), (req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(req.file);
})

.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /imageUpload");
})

.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("DELETE operation not supported on /imageUpload");
});


module.exports = uploadRouter;