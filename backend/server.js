import express from 'express'
import authRoutes from './routes/authRoutes.js'
import dotenv from 'dotenv'
import connectMongoDB from './db/connectMongoDB.js'

// this line is important to read the .env file.
dotenv.config()
const PORT = process.env.PORT

const app = express()
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  connectMongoDB()
})
