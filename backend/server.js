import express from 'express'
import authRoutes from './routes/authRoutes.js'
import dotenv from 'dotenv'
import connectMongoDB from './db/connectMongoDB.js'
import cookieParser from 'cookie-parser'

// this line is important to read the .env file.
dotenv.config()
const PORT = process.env.PORT
const app = express()

app.use(express.json()) // to parse request body
app.use(express.urlencoded({ extended: true })) // to parse form data
app.use(cookieParser()) // to parse cookies

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectMongoDB()
})
