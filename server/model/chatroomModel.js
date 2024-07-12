const { Schema, model } = require('mongoose')

const ChatRoomSchema = new Schema(
   {
      name: String,
      users: [{
         type: Schema.Types.ObjectId,
         ref: 'User'
      }]
   },
   {
      timestamps: true
   }
);

// convert '_id' => 'id' and remove '__v'
ChatRoomSchema.method('toJSON', function () {
   const { __v, _id, ...object } = this.toObject();
   object.id = _id;

   return object;
})

const ChatRoom = model('ChatRoom', ChatRoomSchema);

module.exports = ChatRoom;
