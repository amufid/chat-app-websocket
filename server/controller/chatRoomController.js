const ChatRoom = require('../model/chatroomModel')

const create = async (req, res) => {
   try {
      const { name, users } = req.body

      const chatRoom = new ChatRoom({ name: name, users: users })
      await chatRoom.save()

      res.status(201).json({ message: 'Success', data: chatRoom })
   } catch (error) {
      console.log(error)
   }
}

const findAll = async (req, res) => {
   try {
      const query = req.query.users
      const chatRoom = await ChatRoom.find({ users: query })
      res.status(200).json({ message: 'Success', data: chatRoom })
   } catch (error) {
      console.log(error)
   }
}

module.exports = {
   create,
   findAll,
};
