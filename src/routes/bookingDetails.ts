import express from 'express'
import verifyToken from '../middlewares/auth'
import BookingDetailsController from '../controllers/BookingDetailsController'

const router = express.Router()

router.get('/', BookingDetailsController.getAllDetails)
router.post('/', verifyToken, BookingDetailsController.createDetail)
router.get('/total-cost/:roomId', BookingDetailsController.getTotalCostOfRoom)
router.get(
    '/count-by-room',
    BookingDetailsController.getBookingDetailCountByRoom,
)

export default router
