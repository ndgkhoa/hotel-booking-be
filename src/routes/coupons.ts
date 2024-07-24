import express from 'express'
import CouponsController from '../controllers/CouponsController'
import verifyToken from '../middlewares/auth'
import isSupplier from '../middlewares/isSupplier'

const router = express.Router()

router.get('/', verifyToken, isSupplier, CouponsController.getSupplierCoupon)
router.post('/', verifyToken, isSupplier, CouponsController.createCoupon)
router.post('/:bookingId/use-coupon', CouponsController.useCoupon)
export default router
