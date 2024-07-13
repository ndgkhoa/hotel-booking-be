import express from 'express'
import verifyToken from '../middlewares/auth'
import UsersController from '../controllers/UsersController'

const router = express.Router()

router.get('/', UsersController.getAllUser)
router.get('/me', verifyToken, UsersController.getUser)
router.get('/:id', verifyToken, UsersController.getHotelFromUser)
router.post('/become-supplier', verifyToken, UsersController.becomeSupplier)

export default router
