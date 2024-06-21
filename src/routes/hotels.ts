import express from 'express'
import upload from '../config/multerConfig'
import HotelsController from '../controllers/HotelsController'
import verifyToken from '../middlewares/auth'
import hotelValidation from '../middlewares/hotelValidation'
import { param } from 'express-validator'

const router = express.Router()

router.post(
    '/',
    verifyToken,
    hotelValidation,
    upload.array('imageFiles', 6),
    HotelsController.createHotel,
)

router.get('/search', HotelsController.search)
router.get('/', verifyToken, HotelsController.getAllHotels)
router.get(
    '/:id',
    [param('id').notEmpty().withMessage('Hotel Id is required')],
    HotelsController.getHotel,
)
router.put(
    '/:hotelId',
    verifyToken,
    upload.array('imageFiles'),
    HotelsController.updateHotel,
)

export default router
