import { Router } from "express"
import { getRentals } from ""

const router = Router ()


router.get("/rentals", getRentals)