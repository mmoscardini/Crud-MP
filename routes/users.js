const express = require('express');
const router = express.Router();
const UserSchema = require('../models/userModel');
const passport = require ('passport');
const jwt = require('jsonwebtoken');
const configDB = require('../config/database');

router.post('/register', (req,res,next)=> {
    let newUser = new UserSchema({
        email: req.body.email,
        password: req.body.password
    });

    UserSchema.getUserByEmail(newUser.email,function(err, user){
        if (err) throw err;
        if (user){
            return res.json({success: false, msg: 'Email já cadastrado'});            
        }
    });

    UserSchema.addUser(newUser,function(err, user){
        if (err)
            res.json({success: false, msg: 'Falha ao registrar usuário. Por favor, tente novamente'});
        else 
            res.json({success: true, msg: 'Usuário registrado com sucesso'});
    });

});

router.post('/loginAuth', (req,res,next)=> {
    const email = req.body.email;
    const password = req.body.password;

    //Requerir dados do usuário via email da base de dados
    UserSchema.getUserByEmail(email, function(err, user){
        if (err) throw err;
        if (!user){
            return res.json({success: false, msg: 'Usuário não cadastrado'});
        }
        //Compar senhas
        UserSchema.comparePasswords(password, user.password, function(err, isMatched){
            if (err) throw err;

            //Senha correta
            if (isMatched){
                const token = jwt.sign({user: user}, configDB.secret, {expiresIn: 10800});
                
                return res.json({
                    success:true,
                    msg: 'Login realizado com sucesso',
                    token: 'JWT ' + token,
                    email: user.email
                })
            }
            //Senha incorreta
            else{
                return res.json ({success: false, msg: 'Senha incorreta'});
            }
        });
    });    
});

router.get('/myAccount', passport.authenticate('jwt',{session:false}), (req,res,next)=> {
    res.send('myAccount');
});

module.exports = router;