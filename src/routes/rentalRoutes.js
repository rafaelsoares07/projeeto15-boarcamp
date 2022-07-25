import { Router } from "express";
import { createRentals, deleteRental, listRentals } from "../controllers/rentalsController.js";
const router = Router()
 

router.get('/rentals', listRentals)
router.post('/rentals', createRentals)
router.delete('/rentals/:id', deleteRental)

export default router