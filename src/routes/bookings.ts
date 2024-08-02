import express from 'express'
import verifyToken from '../middlewares/auth'
import BookingsController from '../controllers/BookingsController'

const router = express.Router()

router.get('/get-all', BookingsController.getAll)
router.get('/:bookingId', verifyToken, BookingsController.getBooking)
router.get('/', verifyToken, BookingsController.getMyBookings)
router.post('/:roomId', verifyToken, BookingsController.booking)
router.post('/:roomId/without-login', BookingsController.bookingWithoutLogin)
router.get(
    '/:bookingId/get-hotel',
    verifyToken,
    BookingsController.getHotelFromBookingId,
)
router.put(
    '/:bookingId/pending-cancel',
    verifyToken,
    BookingsController.cancelPendingBooking,
)
router.put(
    '/:bookingId/paid-cancel',
    verifyToken,
    BookingsController.cancelPaidBooking,
)
router.put('/auto-cancel', verifyToken, BookingsController.autoCancel)

export default router
