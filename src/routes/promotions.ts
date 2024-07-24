import express from 'express'
import PromotionController from '../controllers/PromotionController'
import upload from '../config/multerConfig'
import verifyToken from '../middlewares/auth'
import isAdmin from '../middlewares/isAdmin'

const router = express.Router()

router.get('/', PromotionController.getAll)
router.post(
    '/',
    upload.single('image'),
    isAdmin,
    PromotionController.createPromotion,
)
router.put(
    '/:promotionId',
    verifyToken,
    isAdmin,
    PromotionController.changeStatus,
)

export default router
