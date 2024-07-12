const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
   {
      chatRoom: {
         type: Schema.Types.ObjectId,
         ref: 'ChatRoom',
         required: true
      },
      sender: {
         type: Schema.Types.ObjectId,
         ref: 'User',
         required: true
      },
      message: {
         type: String,
         required: true
      },
   },
   {
      timestamps: true
   }
)

MessageSchema.method('toJSON', function () {
   const { __v, _id, ...object } = this.toObject();
   object.id = _id;
   return object;
})

const Message = model('Message', MessageSchema);

module.exports = Message;
