const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const UserSchema = require ('../models/userModel');
const configDB = require('../config/database');

module.exports = function (passport){
    //options
    let opts ={};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = configDB.secret;
    passport.use(new JwtStrategy(opts,function(jwtPayload, done){
        //console.log (jwtPayload);
        UserSchema.getUserByID(jwtPayload._id, function(err, user){
            if (err){
                return done (err, false);
            }

            if (user){
                return done (null, user);
                console.log (user);
            }
            else {
                return done (null, false);
            }
        });
    }));
}