import express from 'express'
import CategoriesController from '../controllers/CategoriesController'
import verifyToken from '../middlewares/auth'
import isAdmin from '../middlewares/isAdmin'

const router = express.Router()

router.get('/', CategoriesController.getAllCategories)
router.post('/', verifyToken, isAdmin, CategoriesController.createCategory)
router.put(
    '/:categoryId',
    verifyToken,
    isAdmin,
    CategoriesController.updateCategory,
)

export default router
