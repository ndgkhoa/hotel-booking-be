import express from 'express'
import BookingDetailsController from '../controllers/BookingDetailsController'
import verifyToken from '../middlewares/auth'
import isSupplier from '../middlewares/isSupplier'

const router = express.Router()

router.get('/', verifyToken, isSupplier, BookingDetailsController.getAllDetails)

export default router
