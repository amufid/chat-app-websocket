const express = require('express');
const userRouter = express.Router()
const userController = require('../controller/userController');

userRouter.post('/user/register', userController.register)
userRouter.post('/user/login', userController.login)
userRouter.get('/user', userController.findOne)

module.exports = userRouter;
