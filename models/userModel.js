const mongoose = require('mongoose');
const bcrypt = require ('bcryptjs');
const configDB = require ('../config/database');

const UserSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    userType:{
        //0 == Client
        //1 == Supplier
        type: Number,
        required: true
    },
    registerDate:{
        type: String,
        required: true
    },
    resetPasswordToken:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByID = function(id, callback){
    User.findById(id,callback);
}

module.exports. getUserByEmail = function (email, callback){
    const query = {email: email};
    User.findOne(query, callback);
}

module.exports.addUser = function (newUser, callback){   
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            if (err){
                throw err;
            }
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.savePassword = function (user, newPassword, callback){
    //If passwords are diferent hash the new password and save it
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newPassword, salt, function(err, hash){
            if (err){
                throw err;
            }
            user.password = hash;
            user.save(callback);
        });
    }); 
}

module.exports.comparePasswords = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash,function(err, isMatched){
        if (err) throw err;
        callback(null, isMatched);
    });
}