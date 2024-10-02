import mongoose from 'mongoose'

const connectMongoDB = async () => {
  try {
    // conn is a connection object that is returned from mongoose.connect
    // it has a connection property that has a host property which is the host of the database.
    // a host is the server where the database is running.
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error connecting to mongoDB: ${error.message}`)
    process.exit(1) // this means exit the process with failure. 1 is the code for failure.
  }
}

export default connectMongoDB
