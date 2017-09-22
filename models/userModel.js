const mongoose = require('mongoose');
const bcrypt = require ('bcryptjs');
const configDB = require ('../config/database');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByID = function(id, callback){
    User.findById(id,callback);
}

module.exports.addUser = function (newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            if (err)
                throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePasswords = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash,function(err, isMatched){
        if (err) throw err;
        callback(null, isMatched);
    });
}