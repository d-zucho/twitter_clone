/**
 * controllers are responsible for handling the incoming requests and returning the appropriate response to the client.
 * They differ from routes in that routes are responsible for defining the endpoints and the HTTP methods that the application will listen to.
 */
import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { generateTokenAndSetCookie } from '../lib/utils/generateTokens.js'

export const signUp = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body

    // check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email' })
    }

    // check if user already exists
    const existingUser = await User.findOne({ username }) // samer as { username: username }
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    // check if email already exists
    const existingEmail = await User.findOne({ email })
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' })
    }

    //? hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    })

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save()

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      })
    } else {
      res.status(400).json({ error: 'Invalid user data' })
    }
  } catch (error) {
    console.log('Error in signUp controller : ', error)
    res.status(500).json({ error: 'Internal server error!' })
  }
}

export const login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ''
    )

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    generateTokenAndSetCookie(user._id, res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    })
  } catch (error) {
    console.log('Error in signUp controller : ', error)
    res.status(500).json({ error: 'Internal server error!' })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.log('Error in logout controller : ', error)
    res.status(500).json({ error: 'Internal server error!' })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    res.status(200).json(user)
  } catch (error) {
    console.log('Error in getMe controller : ', error)
    res.status(500).json({ error: 'Internal server error!' })
  }
}
