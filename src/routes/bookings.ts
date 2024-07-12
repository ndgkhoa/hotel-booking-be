import express from 'express'
import verifyToken from '../middlewares/auth'
import BookingsController from '../controllers/BookingsController'

const router = express.Router()

//router.post('/:roomId', BookingsController.bookingWithoutLogin)

router.get('/', verifyToken, BookingsController.getMyBookings)
router.post('/:roomId', verifyToken, BookingsController.booking)

export default router
