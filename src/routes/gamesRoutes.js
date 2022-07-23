import { Router } from "express";
import { createGame, listBoardGames } from "../controllers/gamesControllers.js";
const router = Router() 

router.post('/games',createGame)
router.get('/games', listBoardGames)

export default router
