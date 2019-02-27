const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const mongoose = require('mongoose')

//LOAD USER MODEL
require('../models/User')
const Users = mongoose.model('users')

// USER LOGIN
router.get('/login', (req,res) => {
    res.render('users/login')
})

//USER REGISTRATION
router.get('/register', (req,res) => {
    res.render('users/register')
})

//LOGIN FORM POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

//REGISTER FORM POST
router.post('/register', (req, res) => {
   let errors = []
   if(req.body.password !== req.body.password2){
       errors.push({text:'Passwords do not match'})
   }

   if(req.body.password.length < 4){
       errors.push({text:'Password must be at least 4 characters'})
   }

   if(errors.length > 0){
        res.render('users/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
   } else {
       Users.findOne({email:req.body.email}).then(user => {
           if(user){
                req.flash('error_msg', 'Email already Registered')
                res.redirect('/users/register')
           } else {
            const newUser = new Users({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })
            bcrypt.genSalt(10, (err, salt) => {
                 bcrypt.hash(newUser.password, salt, (err, hash) => {
           
                     newUser.password = hash
                     newUser.save().then(user => {
                         req.flash('success_msg', 'You are now registered and can now log in')
                         res.redirect('/users/login')
                     }).catch((err) => {
                        console.log(err)
                        return; 
                     })
                 })
            })
     
           }
       })
       }
})

//logout user
router.get('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})

router.use('/users', Users)

module.exports = router;
