import express from 'express'
import CategoriesController from '../controllers/CategoriesController'

const router = express.Router()

router.get('/', CategoriesController.getAllCategories)
router.post('/', CategoriesController.createCategory)

export default router
