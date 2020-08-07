const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const {knex,koneksi} = require('../database/db')
const bcrypt = require('bcrypt')
let withAuth = require('../middleware/middleware');
process.env.SECRET_KEY = 'secret';
module.exports = {
    register : async (req,res,next) => {
        try{
            const userData = {
                email : req.body.email,
                password : bcrypt.hashSync(req.body.password,5),
                id_roles : req.body.id_roles
            }
            knex('in_users').where({
                email : req.body.email
            }).then((row) => {
                if(row.length === 0){
                    knex('in_users').insert(userData)
                    .then(result => {
                         return result ? res.send(true) : res.send(false)
                    });
                }else{
                    res.send({
                        message : "Email Already Exist"
                    })
                }
            })
        }catch(e){
            console.log(e);
        }
    },
    login : async (req,res,next) => {
        try {
            knex('in_users').where({
                email : req.body.email
            }).then(row => {
                if(row.length > 0){
                    try{
                        if(bcrypt.compareSync(req.body.password,row[0].password)){
                            let token = jwt.sign({
                                email : req.body.email,
                                role  : row[0].id_roles
                            },process.env.SECRET_KET,{
                                expiresIn : 60*60
                            });
                            res.cookie('token', token, { httpOnly: true }).send({
                                token : token,
                                email : req.body.email
                            });
                        }else{
                            res.send({
                                message : 'incorrect'
                            });
                        }
                    }catch(e){
                        console.log(e);
                    }
                }else{
                    res.send({
                        message : 'incorrect'
                    });
                }
            });
        } catch (e) {
            console.log(e);
        }
    },
    checkToken : async(req,res,next) => {
        res.sendStatus(200);
    }
}
