import express from 'express'
import upload from '../config/multerConfig'
import HotelsController from '../controllers/HotelsController'
import verifyToken from '../middlewares/auth'
import hotelValidation from '../middlewares/hotelValidation'

const router = express.Router()

router.post(
    '/',
    verifyToken,
    hotelValidation,
    upload.array('imageFiles', 6),
    HotelsController.createHotel,
)

router.get('/', verifyToken, HotelsController.getAllHotels)

export default router
