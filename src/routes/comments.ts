import express from 'express'
import CommentsController from '../controllers/CommentsController'
import verifyToken from '../middlewares/auth'
import isSupplier from '../middlewares/isSupplier'

const router = express.Router()

router.get('/:hotelId', CommentsController.getAllCommentsOfHotel)
router.post('/:hotelId', verifyToken, CommentsController.createComment)
router.put(
    '/:commentId',
    verifyToken,
    isSupplier,
    CommentsController.changeStatus,
)

export default router
