import express, { Request, Response } from 'express'
import upload from '../config/multerConfig'
import HotelsController from '../controllers/HotelsController'
import verifyToken from '../middlewares/auth'
import { param } from 'express-validator'
import Hotel from '../models/hotel'

const router = express.Router()

router.post(
    '/',
    verifyToken,
    upload.array('imageFiles', 6),
    HotelsController.createHotel,
)
router.get('/', async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find().sort('-lastUpdated')
        res.json(hotels)
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: 'Error fetching hotels' })
    }
})
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
