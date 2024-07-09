import express from 'express'
import verifyToken from '../middlewares/auth'
import BookingDetailsController from '../controllers/BookingDetailsController'

const router = express.Router()

router.get('/', BookingDetailsController.getAllDetails)
router.post('/', verifyToken, BookingDetailsController.createDetail)
router.get('/:roomId', BookingDetailsController.getTotalCostByHotelId)

export default router
