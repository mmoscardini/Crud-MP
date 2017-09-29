const express = require('express');
const router = express.Router();
const UserSchema = require('../models/userModel');
const passport = require ('passport');
const jwt = require('jsonwebtoken');
const configDB = require('../config/database');
var CPF = require("cpf_cnpj").CPF;


//Rota para registro de novos usuários-Clientes
router.post('/registerClient', (req,res,next)=> {
    let date = new Date();
    
    let newUser = new UserSchema({
        username: req.body.name,
        email: req.body.email,
        password: req.body.password,
        userType: 0,
        registerDate: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    });

    UserSchema.getUserByEmail(newUser.email,function(err, user){
        if (err) throw err;
        if (user){
            return res.json({success: false, msg: 'Email já cadastrado'});            
        }
    });

    UserSchema.addUser(newUser,function(err, user){
        if (err){
            console.log (err);
            res.json({success: false, msg: 'Falha ao registrar usuário. Por favor, tente novamente'});
        }
        else 
            res.json({success: true, msg: 'Usuário registrado com sucesso'});
    });

});

//Rota para alteração de senha
router.post ('/resetPassword', passport.authenticate('jwt', {session: false}),(req, res, next)=>{
    const email = req.body.email;
    const currentPassCheck = req.body.currentPass;
    const newPassword = req.body.newPassword;

    UserSchema.getUserByEmail(email, function(err, user){
        if (err) throw err;

        if (!user){
            return res.json({success: false, msg: 'Usuário não encontrado'});
        }

        UserSchema.comparePasswords(currentPassCheck, user.password, (err, isMatched)=>{
            if (isMatched){
                if (err) throw err;
                UserSchema.comparePasswords(newPassword, user.password, (err, isMatched)=>{
                    if (err) throw err;
                    
                    if (isMatched){
                        return res.json({success: false, msg: 'Essa é sua senha atual. Porfavor, escolha outra.'});
                    }
        
                    UserSchema.savePassword(user, newPassword, (err, user)=>{
                        if (err || !user) {
                            res.json({success: false, msg: 'Falha ao alterar senha. Por favor, tente novamente'});                    
                        }
        
                        if (user){
                            res.json({success: true, msg: 'Senha alterada com sucesso!'});                    
                        }
                    });
                });
            }
            else {
                return res.json({success: false, msg: 'Senha atual incorreta.'});
            }
        })

        
    });
    
})

//Rota para login
router.post('/loginAuth', (req,res,next)=> {
    const email = req.body.email;
    const password = req.body.password;
    const userType = req.body.userType;

    //Requerir dados do usuário via email da base de dados
    UserSchema.getUserByEmail(email, function(err, user){
        if (err) throw err;
        if (!user){
            return res.json({success: false, msg: 'Usuário não cadastrado'});
        }
        //Compar senhas
        UserSchema.comparePasswords(password, user.password, function(err, isMatched){
            //if (err) throw err;
            //Senha correta
            if (isMatched){
                const token = jwt.sign(user.toObject(), configDB.secret, {expiresIn: 10800});
                
                return res.json({
                    success:true,
                    msg: 'Login realizado com sucesso',
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        userType: user.userType,
                    }
                });
            }
            //Senha incorreta
            else{
                return res.json ({success: false, msg: 'Senha incorreta'});
            }
        });
    });    
});

//Rota do perfil
router.get('/myAccount', passport.authenticate('jwt', {session: false}),  (req,res,next)=> {
    res.json({user: req.user});
});

//Rota edição do perfil
router.post('/myAccount/edit', passport.authenticate('jwt', {session: false}),  (req,res,next)=> {
    const userId = req.body.userId;
    const username = req.body.username;
    const email = req.body.email;
    const cpf = req.body.cpf;
    const address = {
        street: req.body.address.street, 
        complement: req.body.address.complement, 
        city: req.body.address.city, 
        state: req.body.address.state,
        cep: req.body.address.cep
    };

    if (!CPF.isValid(cpf)){
        return res.json({success: false, msg: 'CPF inválido'});
    }
    let updatedUser = {username: username, email:email, cpf: cpf, address: address};
    
    UserSchema.update({_id: userId}, updatedUser, function(err, result){
        if (err) throw err;

        console.log (result);
        return res.json({success: true, msg: result.nModified + ' itens foram alterados com sucesso'});
    });
            
});

module.exports = router;