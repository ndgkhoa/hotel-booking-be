import express from 'express'
import verifyToken from '../middlewares/auth'
import ReceiptsController from '../controllers/ReceiptsController'

const router = express.Router()
//router.get('/', verifyToken, ReceiptsController.getReceiptsByUserId)
router.post('/:bookingId', verifyToken, ReceiptsController.createReceipt)

router.get('/payment/callback', ReceiptsController.vnPayCallback)

export default router
