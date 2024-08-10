import express from 'express'
import StatisticsController from '../controllers/StatisticsController'
import verifyToken from '../middlewares/auth'
import isSupplier from '../middlewares/isSupplier'

const router = express.Router()

router.get(
    '/supplier-revenue',
    verifyToken,
    isSupplier,
    StatisticsController.getMonthlySupplierRevenue,
)
router.get(
    '/hotel-revenue/',
    verifyToken,
    isSupplier,
    StatisticsController.getHotelsRevenueBySupplier,
)
router.get(
    '/monthly-hotel-revenue/:hotelId',
    verifyToken,
    isSupplier,
    StatisticsController.getMonthlyHotelRevenue,
)
router.get(
    '/room-revenue',
    verifyToken,
    isSupplier,
    StatisticsController.getRoomsRevenueBySupplier,
)
router.get(
    '/rooms-revenue-hotel/:hotelId',
    verifyToken,
    isSupplier,
    StatisticsController.getRoomsRevenueOfHotelBySupplier,
)
router.get(
    '/daily-room-revenue/:roomId',
    verifyToken,
    isSupplier,
    StatisticsController.getDailyRoomRevenue,
)
router.get(
    '/total-cost/:roomId',
    verifyToken,
    isSupplier,
    StatisticsController.getTotalCostOfRoom,
)
router.get(
    '/count-by-room',
    verifyToken,
    isSupplier,
    StatisticsController.getBookingDetailCountByRoom,
)

export default router
