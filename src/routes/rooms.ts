import express from 'express'
import verifyToken from '../middlewares/auth'
import upload from '../config/multerConfig'
import RoomsController from '../controllers/RoomsControllers'
import isSupplier from '../middlewares/isSupplier'

const router = express.Router()

router.post(
    '/:hotelId',
    verifyToken,
    isSupplier,
    upload.array('imageFiles', 6),
    RoomsController.createRoom,
)
router.get('/:hotelId', RoomsController.getAllRoomsOfHotel)
router.get(
    '/:roomId/change-status',
    verifyToken,
    isSupplier,
    RoomsController.changeStatus,
)
router.get('/:roomId/detail', RoomsController.getRoom)
router.put(
    '/:roomId',
    verifyToken,
    isSupplier,
    upload.array('imageFiles'),
    RoomsController.updateRoom,
)
router.put('/:hotelId/reset-status', RoomsController.resetStatus)

export default router
