import {
    loginValidation,
    registerValidation,
} from '../middlewares/validationMiddleware'
import verifyToken from '../middlewares/auth'

const router = require('express').Router()
const AuthController = require('../controllers/AuthController')

router.post('/register', registerValidation, AuthController.registerUser)
router.post('/login', loginValidation, AuthController.loginUser)
router.get('/', AuthController.getAllUser)
router.get('/validate-token', verifyToken, AuthController.verifyToken)
router.post('/logout', AuthController.logout)

export default router
