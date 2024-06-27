import express from 'express'
import CategoriesController from '../controllers/CategoriesController'

const router = express.Router()

router.get('/', CategoriesController.getAllCategories)
router.post('/', CategoriesController.createCategory)
router.delete('/:categoryId', CategoriesController.deleteCategory)

export default router
