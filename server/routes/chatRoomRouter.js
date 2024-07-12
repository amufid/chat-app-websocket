const express = require('express');
const chatRoomRouter = express.Router()
const chatRoomController = require('../controller/chatRoomController');

chatRoomRouter.post('/chatRoom', chatRoomController.create)
chatRoomRouter.get('/chatRoom', chatRoomController.findAll)


module.exports = chatRoomRouter;
