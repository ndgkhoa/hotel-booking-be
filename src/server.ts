import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import accountRoutes from './routes/accounts'
import categoriesRoutes from './routes/categories'
import hotelsRoutes from './routes/hotels'
import roomsRoutes from './routes/rooms'
import promotionsRoutes from './routes/promotions'
import couponRoutes from './routes/coupons'
import receiptsRoutes from './routes/receipts'
import bookingsRoutes from './routes/bookings'
import bookingDetailsRoutes from './routes/bookingDetails'
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

app.use('/api/auth', authRoutes)
app.use('/api/hotels', hotelsRoutes)
app.use('/api/rooms', roomsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/accounts', accountRoutes)
app.use('/api/receipts', receiptsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/promotions', promotionsRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/bookings', bookingsRoutes)
app.use('/api/bookingDetails', bookingDetailsRoutes)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})
