import express from 'express'
import StatisticsController from '../controllers/StatisticsController'

const router = express.Router()

router.get('/monthly-revenue', StatisticsController.getMonthlyRevenue)
router.get('/hotel-revenue/:hotelId', StatisticsController.getHotelRevenue)
router.get('/total-cost/:roomId', StatisticsController.getTotalCostOfRoom)
router.get('/count-by-room', StatisticsController.getBookingDetailCountByRoom)

export default router
