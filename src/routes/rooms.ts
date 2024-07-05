import express from 'express'
import verifyToken from '../middlewares/auth'

const router = express.Router()
const RoomsController = require('../controllers/RoomsControllers')



export default router
