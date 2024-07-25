import express from 'express'
import verifyToken from '../middlewares/auth'
import UsersController from '../controllers/UsersController'
import isAdmin from '../middlewares/isAdmin'

const router = express.Router()

router.get('/', verifyToken, isAdmin, UsersController.getAllUser)
router.get('/me', verifyToken, UsersController.getUser)
router.get('/:id', verifyToken, UsersController.getHotelFromUser)
router.post('/become-supplier', verifyToken, UsersController.becomeSupplier)
router.post('/verify-supplier-code', verifyToken, UsersController.verifySupplierCode)
router.put('/:userId', verifyToken, isAdmin, UsersController.changeStatus)

export default router
