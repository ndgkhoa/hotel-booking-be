import express from 'express'
import StatisticsController from '../controllers/StatisticsController'
import verifyToken from '../middlewares/auth'

const router = express.Router()

router.get('/monthly-revenue', StatisticsController.getMonthlyRevenue)
router.get('/hotel-revenue/', StatisticsController.getHotelRevenue)
router.get('/total-cost/:roomId', StatisticsController.getTotalCostOfRoom)
router.get('/count-by-room', StatisticsController.getBookingDetailCountByRoom)
router.get(
    '/supplier-revenue',
    verifyToken,
    StatisticsController.getSuppliersRevenue,
)

export default router
