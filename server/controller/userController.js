const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const secret = 'xpiaflssadgf394727'

const register = async (req, res) => {
   try {
      const { username, email, password, photo } = req.body

      const findUser = await User.findOne({ email: email })

      if (findUser) throw { message: 'Email is registered' }

      const hashPassword = await bcrypt.hash(password, 10)

      const user = new User({
         username: username,
         email: email,
         password: hashPassword,
         photo: photo
      })

      await user.save();

      res.status(201).json({ message: 'Success', data: user })
   } catch (error) {
      console.log(error)
   }
}

const login = async (req, res) => {
   try {
      const { email, password } = req.body

      const findUser = await User.findOne({ email: email })

      const comparePassword = bcrypt.compare(password, findUser.password)

      if (!comparePassword) throw { message: 'Invalid Credentials' }

      const token = jwt.sign(findUser.id, secret)

      res.status(200).json({ message: 'Success', token })
   } catch (error) {
      console.log(error)
   }
}

const findOne = async (req, res) => {
   try {
      let query = req.query.email
      let queryId = req.query.id
      let search;

      if (query) {
         search = { email: query }
      } else if (queryId) {
         search = { _id: queryId }
      }

      const user = await User.find(search)

      if (user.length === 0) {
         res.status(404).json({ message: 'User not found' })
      } else {
         res.status(200).json({ message: 'Sucess', data: user })
      }
   } catch (error) {
      console.log(error)
   }
}

module.exports = {
   register,
   login,
   findOne,
};