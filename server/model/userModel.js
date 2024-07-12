const { Schema, model } = require("mongoose");

const usersSchema = new Schema(
   {
      username: String,
      email: {
         type: String,
         unique: true
      },
      password: String,
      photo: {
         type: String,
         required: false
      }
   },
   {
      timestamps: true
   }
)

// convert '_id' => 'id' and remove '__v'
usersSchema.method('toJSON', function () {
   const { __v, _id, ...object } = this.toObject();
   object.id = _id;

   return object;
})

const User = model('User', usersSchema)

module.exports = User;
