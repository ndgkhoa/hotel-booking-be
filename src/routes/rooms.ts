import express from 'express'
import verifyToken from '../middlewares/auth'
import upload from '../config/multerConfig'

const router = express.Router()
const RoomsController = require('../controllers/RoomsControllers')

router.post(
    '/:hotelId',
    verifyToken,
    upload.array('imageFiles', 6),
    RoomsController.createHotel,
)

export default router
