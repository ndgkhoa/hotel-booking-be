import express from 'express'
import StatisticsController from '../controllers/StatisticsController'
import verifyToken from '../middlewares/auth'
import isSupplier from '../middlewares/isSupplier'

const router = express.Router()

router.get(
    '/room-revenue',
    verifyToken,
    isSupplier,
    StatisticsController.getRoomRevenueOfSupplier,
)
router.get(
    '/hotel-revenue/',
    verifyToken,
    isSupplier,
    StatisticsController.getHotelRevenue,
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
router.get(
    '/supplier-revenue',
    verifyToken,
    isSupplier,
    StatisticsController.getSuppliersRevenue,
)

export default router
