import { Router } from "express";
import {
    getCustomers,
    getCustomer,
    postCustomer,
} from "../controllers/customersControllers.js";
import { availableCpf } from "../middlewares/availableCpf.js";
import { validateCustomerData } from "../middlewares/schemas/validateCustomerData.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomer);
router.post("/customers", validateCustomerData, availableCpf, postCustomer);

export default router;
