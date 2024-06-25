import express from 'express'

const router = express.Router()
const AccountController = require('../controllers/AccountsController')

router.put('/:accountId', AccountController.changePassword)

export default router
