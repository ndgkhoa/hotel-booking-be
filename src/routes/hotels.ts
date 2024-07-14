import express from 'express'
import upload from '../config/multerConfig'
import HotelsController from '../controllers/HotelsController'
import verifyToken from '../middlewares/auth'
import { param } from 'express-validator'
import { search } from '../controllers/SearchController'

const router = express.Router()

router.post(
    '/',
    verifyToken,
    upload.array('imageFiles', 6),
    HotelsController.createHotel,
)
router.get('/', HotelsController.getAllHotels)
router.get('/search', search)
router.get('/', verifyToken, HotelsController.getAllHotelsOfAuthor)
router.get(
    '/:hotelId',
    [param('hotelId').notEmpty().withMessage('Hotel Id is required')],
    HotelsController.getHotel,
)
router.put(
    '/:hotelId',
    verifyToken,
    upload.array('imageFiles'),
    HotelsController.updateHotel,
)
router.put(
    '/:hotelId/change-status',
    verifyToken,
    HotelsController.changeStatus,
)

export default router
