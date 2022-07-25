import { Router } from "express";
import { createRentals, deleteRental, finalizeRentals, listRentals } from "../controllers/rentalsController.js";
const router = Router()
 

router.get('/rentals', listRentals)
router.post('/rentals', createRentals)
router.delete('/rentals/:id', deleteRental)
router.post('/rentals/:id/return',finalizeRentals)
export default router