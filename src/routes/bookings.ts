import express from 'express'
import verifyToken from '../middlewares/auth'
import BookingsController from '../controllers/BookingsController'

const router = express.Router()

router.post('/:hotelId', verifyToken, BookingsController.booking)

export default router
