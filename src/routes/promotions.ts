import express from 'express'
import PromotionController from '../controllers/PromotionController'
import upload from '../config/multerConfig'
import verifyToken from '../middlewares/auth'

const router = express.Router()

router.get('/', PromotionController.getAll)
router.post('/', upload.single('image'), PromotionController.createPromotion)
router.put('/:promotionId', verifyToken, PromotionController.changeStatus)

export default router
