import express from 'express'
import CouponsController from '../controllers/CouponsController'

const router = express.Router()

router.post('/', CouponsController.createCoupon)

export default router
