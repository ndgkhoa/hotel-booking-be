import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
        console.log('Connected to MongoDB ')
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err)
    }
}

export default connectDB
