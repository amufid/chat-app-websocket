const Message = require('../model/messageModel')

const findAll = async (req, res) => {
   try {
      let query = req.query

      if (query.chatRoom === 'undefined' || query.chatRoom === 'null') {
         return res.status(404).json({ message: 'Not found' })
      } else {
         const messages = await Message.find(query);

         res.status(200).json(messages);
      }
   } catch (error) {
      console.log(error)
   }
}


module.exports = {
   findAll,
}
