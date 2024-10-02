import mongoose from 'mongoose'
import { type } from 'os'

const userSchema = new mongoose.Schema(
  {
    // field for each user
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      // array of users with each user having an id
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to the User model
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to the User model
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: '',
    },
    coverImg: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

// create a model from the userSchema
const User = mongoose.model('User', userSchema)

export default User
