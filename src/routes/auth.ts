import verifyToken from '../middlewares/auth'
import isSupplier from '../middlewares/isSupplier'

const router = require('express').Router()
const AuthController = require('../controllers/AuthController')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.post('/login-dashboard', isSupplier, AuthController.login)
router.get('/verify-token', verifyToken, AuthController.verifyToken)
router.post('/logout', AuthController.logout)

export default router
