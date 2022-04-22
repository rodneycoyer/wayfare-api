const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/userModel");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const FacebookTokenStrategy = require("passport-facebook-token");

// dev env secrets
require("dotenv").config();

// passport.js local strategy
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// create user with passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// create jwt that expires in 1 hr
exports.getToken = user => {
    return jwt.sign(user, process.env.SECRET_KEY, {expiresIn: 3600});
};

// jwt options - expect in req.header
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.SECRET_KEY;

// jwt authentication with passport
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

// verify user jwt
exports.verifyUser = passport.authenticate("jwt", {session: false});

// authenticate admin
exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        return next();
    } else {
        const err = new Error("you are not authorized");
        err.status = 403;
        return next(err);
    }
};

// facebook O-Auth strategy
// exports.facebookPassport = passport.use(
//     new FacebookTokenStrategy(
//         {
//             clientID: process.env.FACEBOOK_ClientId,
//             clientSecret: process.env.FACEBOOK_ClientSecret
//         },
//         (accessToken, refreshToken, profile, done) => {
//             User.findOne({facebookId: profile.id}, (err, user) => {
//                 if (err) {
//                     return done(err, false);
//                 }
//                 if (!err && user) {
//                     return done(null, user);
//                 } else {
//                     user = new User({ username: profile.displayName });
//                     user.facebookId = profile.id;
//                     user.firstname = profile.name.givenName;
//                     user.lastname = profile.name.familyName;
//                     user.save((err, user) => {
//                         if (err) {
//                             return done(err, false);
//                         } else {
//                             return done(null, user);
//                         }
//                     });
//                 }
//             });
//         }
//     )
// );