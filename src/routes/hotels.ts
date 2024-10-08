import express from 'express'
import upload from '../config/multerConfig'
import HotelsController from '../controllers/HotelsController'
import verifyToken from '../middlewares/auth'
import { search } from '../controllers/SearchController'
import isSupplier from '../middlewares/isSupplier'
import isAdmin from '../middlewares/isAdmin'

const router = express.Router()

router.post(
    '/',
    verifyToken,
    isSupplier,
    upload.array('imageFiles', 6),
    HotelsController.createHotel,
)
router.get('/', HotelsController.getAllHotels)
router.get('/search', search)
router.get(
    '/supplier-hotels',
    verifyToken,
    isSupplier,
    HotelsController.getAllHotelsOfSupplier,
)
router.get('/:hotelId', HotelsController.getHotel)
router.put(
    '/:hotelId',
    verifyToken,
    isSupplier,
    upload.array('imageFiles'),
    HotelsController.updateHotel,
)
router.put(
    '/:hotelId/change-status',
    verifyToken,
    isSupplier || isAdmin,
    HotelsController.changeStatus,
)

export default router
