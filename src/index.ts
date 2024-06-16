import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import hotelsRoutes from './routes/hotels'
import cookieParser from 'cookie-parser'
import cloudinaryConfig from './config/cloudinaryConfig'

connectDB()
cloudinaryConfig()

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }),
)

// app.use(express.static(path.join(__dirname, '../../frontend/dist')))

app.use('/api/auth', authRoutes)
app.use('/api/hotels', hotelsRoutes)
// app.get('*', (req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
// })

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
