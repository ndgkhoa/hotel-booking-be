import express from 'express'
import PromotionController from '../controllers/PromotionController'
import upload from '../config/multerConfig';

const router = express.Router()

router.post('/', upload.single('image'), PromotionController.createPromotion);

export default router
