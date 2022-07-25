import { Router } from "express"
import { getCategories, postCategories } from "../controllers/categoriesController.js";
import { availableCategory } from "../middlewares/availableCategory.js";
import { validateCategory } from "../middlewares/schemas/validateCategory.js";

const router = Router();

router.get("/categories", getCategories)
router.post("/categories", validateCategory, availableCategory, postCategories)

export default router