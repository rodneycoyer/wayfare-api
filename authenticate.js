const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/userModel");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

const config = require("./config");

// implement local strategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// used for sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// create jwt that expires in 1 hr
exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

// jwt strategy options with passport
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); // expect token in req.header
options.secretOrKey = config.secretKey;

// verify function from jwt documentation
exports.jwtPassport = passport.use(
    new JwtStrategy(
        options,
        (jwt_payload, done) => {
            console.log("JWT payload:", jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate("jwt", {session: false});

exports.verifyAdmin = (req, req, next) => {
    if (req.user.admin) {
        return next();
    } else {
        const err = new Error("you are not authorized");
        err.status = 403;
        return next(err);
    }
};