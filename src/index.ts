import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db'
import authRoutes from './routes/auth'

connectDB()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/auth', authRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
