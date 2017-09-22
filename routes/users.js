const express = require('express');
const router = express.Router();
const UserSchema = require('../models/userModel');

router.post('/register', (req,res,next)=> {
    let newUser = new UserSchema({
        email: req.body.email,
        password: req.body.password
    });

    UserSchema.addUser(newUser,function(err, user){
        if (err)
            res.json({success: false, msg: 'Falha ao registrar usuário. Por favor, tente novamente'});
        else 
            res.json({success: true, msg: 'Usuário registrado com sucesso'});
    });

});

router.post('/auth', (req,res,next)=> {
    res.send('register');
});

router.get('/myAccount', (req,res,next)=> {
    res.send('register');
});

module.exports = router;