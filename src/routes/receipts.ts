import express from 'express'
import verifyToken from '../middlewares/auth'
import ReceiptsController from '../controllers/ReceiptsController'

const router = express.Router()

router.post('/:hotelId', verifyToken, ReceiptsController.createReceipt)

export default router