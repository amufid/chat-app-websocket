const express = require('express')
const messageController = require('../controller/messageController')
const messageRouter = express.Router()

messageRouter.get('/messages', messageController.findAll)

module.exports = messageRouter;
