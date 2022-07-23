import { Router } from "express";
import { createCategory, listCategories } from "../controllers/categoriesController.js";

const router = Router();

router.post('/categories', createCategory)
router.get('/categories',listCategories)

export default router  