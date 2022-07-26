import connection from "../dbStrategy/database.js";

import { createGameSchema } from "../schemas/createGameShema.js";

export async function createGame(req, res){

    try{
        const game = req.body;
        const{name,image,stockTotal,categoryId,pricePerDay} = req.body

        const gameValid = createGameSchema.validate(game)

        if(gameValid.error){
            res.status(400).send('algo de errado nos campos colocados')
            return
        }

       
        const categoryExist = await connection.query(
        `SELECT * FROM categories
         WHERE categories.id = ${categoryId} `
        )

        
        if(categoryExist.rows.length===0){
            res.status(400).send('Categoria não existe ')
            return
        }

        const gameExist = await connection.query(
            `SELECT * FROM games 
            WHERE games.name = $1`, 
            [game.name] 
        );

        if(gameExist.rows.length>0){
            res.status(201).send('Jogo já está cadastrado')
            return
        }

        await connection.query(    
       `INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") 
        VALUES ($1,$2,$3,$4,$5)`,
        [name, image,stockTotal,categoryId,pricePerDay]
        )
            
        res.status(201).send('criou o novo jogo')
        

    }
    catch(error){
        console.log(error)

    }  

}


export async function listBoardGames(req, res){

    try{
        const {name} = req.query
        console.log(name)

        //OBS || É A CONCATENACAO DO SQL 
        if(name){
            const {rows:gameStringSeach} = await connection.query(
            `SELECT games.*, categories.name as "categoryName" FROM games
            JOIN categories
            ON categories.id= games."categoryId"
            WHERE games.name ILIKE $1 || '%'`, 
            [name]
            )
            res.status(200).send(gameStringSeach)

        }
        else{
            const {rows:games} = await connection.query(
           `SELECT games.*, categories.name as "categoryName" FROM games
            JOIN categories
            ON categories.id= games."categoryId";`
            )
            res.status(200).send(games)
        }
    }
    catch(error){
        console.log(error)
    }
} 