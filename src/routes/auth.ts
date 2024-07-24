import verifyToken from '../middlewares/auth'

const router = require('express').Router()
const AuthController = require('../controllers/AuthController')

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)
router.get('/verify-token', verifyToken, AuthController.verifyToken)
router.post('/refresh-token', AuthController.refreshToken)
router.post('/logout', AuthController.logout)

export default router
