import { Router } from "express";
import {listCustomers, listCustomerById, insertCostumer} from "../controllers/costumersController.js";


const router = Router();

router.get('/customers', listCustomers)
router.get('/customers/:id', listCustomerById)
router.post('/customers',insertCostumer)

export default router;