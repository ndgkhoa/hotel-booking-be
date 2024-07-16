import express from 'express'
import verifyToken from '../middlewares/auth'
import upload from '../config/multerConfig'
import RoomsController from '../controllers/RoomsControllers'

const router = express.Router()

router.post(
    '/:hotelId',
    verifyToken,
    upload.array('imageFiles', 6),
    RoomsController.createRoom,
)
router.get('/:hotelId', RoomsController.getAllRoomsOfHotel)
router.get('/:roomId/change-status', RoomsController.changeStatus)
router.get('/:roomId/detail', RoomsController.getRoom)
router.put(
    '/:roomId',
    verifyToken,
    upload.array('imageFiles'),
    RoomsController.updateRoom,
)
router.put('/:hotelId/reset-status', verifyToken, RoomsController.resetStatus)

export default router
