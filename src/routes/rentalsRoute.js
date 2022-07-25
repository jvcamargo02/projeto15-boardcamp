import { Router } from "express";
import { getRentals, postRentals, postReturn, deleteRent } from "../controllers/rentalsControllers.js";
import { validateRentalPost } from "../middlewares/schemas/validateRentalPost.js";
import {
    existingCustomerId,
    existingGameId,
    checkAvailability,
} from "../middlewares/validateGameId&CustomerId.js";
import { checkReturn } from "../middlewares/checkReturn.js";

const router = Router();

router.get("/rentals", getRentals);
router.post(
    "/rentals",
    validateRentalPost,
    existingCustomerId,
    existingGameId,
    checkAvailability,
    postRentals
);
router.post("/rentals/:id/return", checkReturn, existingGameId, postReturn)
router.delete("/rentals/:id", checkReturn, deleteRent )

export default router;
