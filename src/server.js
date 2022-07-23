import express from "express";
import cors from "cors"


import categoriesRoutes from "./routes/categoriesRoutes.js"
import gamesRoutes from "./routes/gamesRoutes.js"

const server = express()
server.use(cors())
server.use(express.json())  


server.use(categoriesRoutes) 
server.use(gamesRoutes)
 





server.listen(process.env.PORT, ()=>{
    console.log('servidor funfando de boas na porta: '+process.env.PORT)
})