import express from 'express'
import verifyToken from '../middlewares/auth'

const router = express.Router()
const AccountController = require('../controllers/AccountsController')

router.get('/', verifyToken, AccountController.getUser)
router.put('/:accountId', AccountController.changePassword)

export default router
