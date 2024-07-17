import express from 'express'
import BookingDetailsController from '../controllers/BookingDetailsController'

const router = express.Router()

router.get('/', BookingDetailsController.getAllDetails)

export default router
