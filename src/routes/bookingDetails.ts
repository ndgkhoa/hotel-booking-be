import express from 'express'
import verifyToken from '../middlewares/auth'
import BookingDetailsController from '../controllers/BookingDetailsController'

const router = express.Router()

router.get('/', verifyToken, BookingDetailsController.getAllDetails)
router.post('/', verifyToken, BookingDetailsController.createDetail)

export default router
