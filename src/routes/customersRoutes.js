import { Router } from "express";
import {listCustomers, listCustomerById, insertCostumer,updateCostumer} from "../controllers/costumersController.js";


const router = Router();

router.get('/customers', listCustomers)
router.get('/customers/:id', listCustomerById)
router.post('/customers',insertCostumer)
router.put('/customers/:id', updateCostumer)

export default router;