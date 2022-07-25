import { Router } from "express";
import { getGames } from "../controllers/gamesController.js";
import { validateGameData } from "../middlewares/schemas/validateGameData.js";
import {
    availableGameName,
    validateCategoryId,
} from "../middlewares/validateGameName&CategoryId.js";
import { postGames } from "../controllers/gamesController.js";

const router = Router();

router.get("/games", getGames);
router.post(
    "/games",
    validateGameData,
    validateCategoryId,
    availableGameName,
    postGames
);

export default router;
