import {
    loginValidation,
    registerValidation,
} from '../middlewares/validationMiddleware'

const router = require('express').Router()
const AuthController = require('../controllers/AuthController')

router.post('/register', registerValidation, AuthController.registerUser)
router.post('/login', loginValidation, AuthController.loginUser)

export default router
