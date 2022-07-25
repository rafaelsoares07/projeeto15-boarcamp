import dayjs from "dayjs";
import connection from "../dbStrategy/database.js";

function FormatObjectRentals(obj){
    let array = []
    
    for(let item of obj){
        
        const customer={
            id:item.customerId,
            name:item.nameuser
        }
        const game = {
            id:item.gameId,
            name:item.name,
            categotyId:item.categoryId,
            categotyName:item.categoryname
            
        }

        const formatObj = {...item, customer, game}
        delete formatObj.nameuser
        delete formatObj.name
        delete formatObj.image
        delete formatObj.nameuser

        array.push(formatObj)
        
    }
    
    return array
}

export async function listRentals(req, res){

    const customerId = req.query

    if(customerId.length===0){
        res.status(200).send("oii")
        return
    }
    else{
        const {rows:rental} = await connection.query(
        `
        SELECT rentals.*, customers.name as nameUser, games.id as gid ,games.name ,games."stockTotal", games."pricePerDay", categories.id as cid, categories.name as categoryName FROM rentals
        JOIN customers
        ON rentals."customerId" = customers.id
        JOIN games 
        ON rentals."gameId" = games.id
        JOIN categories
        ON games."categoryId" = categories.id
        `    
        )
        
        res.status(200).send(FormatObjectRentals(rental))
    }

}

export async function createRentals(req, res){
    

    try{ 
       
        const{customerId,gameId,daysRented}=req.body;

        const gameExist = await connection.query(`SELECT * FROM games WHERE id = $1`,[gameId]);
        const costumerExist = await connection.query(`SELECT * FROM customers WHERE id = $1`,[customerId])
        

        if(gameExist.rowCount===0){
            res.status(400).send('jogo nao existe')
            return
        }
        if(costumerExist.rowCount===0){
            res.status(400).send('cliente nao existe')
            return
        }

        if(daysRented<=0){
            res.status(400).send('daysRetend invalido')
            return
        }

        const {rows:stockValid} = await connection.query(
        `SELECT * FROM games WHERE id = $1`,
        [gameId]
        )
        
        if(stockValid.rowCount<1){
            res.status(400).send('ID DO JOGO NAO ENCONTRADO')
        }


        const {rows:stock } = await connection.query(
        `
        SELECT rentals.*, games."stockTotal" FROM rentals
        JOIN games
        ON rentals."gameId" = games.id
        WHERE rentals."gameId" = $1  AND rentals."returnDate" IS NULL;
        `,
        [gameId]
        )

    

        const qtdGames = stockValid[0].stockTotal
        console.log("quantidade " + qtdGames)

        const qtdNaoDevolvida = stock?.length
        console.log("quantid nao devolvida" + qtdNaoDevolvida)

        const qtdAux = qtdNaoDevolvida + 1
        
        if((qtdAux)>qtdGames){
            res.status(422).send('nao tem mias jogos em estoque')
            return
        }

        

        const originalPrice = gameExist.rows[0].pricePerDay * daysRented;
        await connection.query(`
        INSERT INTO rentals("customerId","gameId","rentDate","daysRented","originalPrice","returnDate","delayFee")
        VALUES($1,$2,NOW(),$3,$4,NULL,NULL)`
        ,[customerId,gameId,daysRented,originalPrice]);

        res.status(201).send('criou o aluguel'); 
    }
    catch(error){
        console.log(error)
        res.status(500).send('servidor deu pau')
    }
}

export async function deleteRental(req, res){
    const id = req.params.id
    
    await connection.query(
    `DELETE FROM rentals WHERE rentals.id = $1 AND rentals."returnDate" IS NOT NULL
    `,
    [id]
    )

    res.status(200).send('excluido com sucesso')
}

export async function finalizeRentals(req, res){

    try{
        const id = req.params.id

        const rentalExist = await connection.query(`SELECT * FROM rentals WHERE id = $1`,[id])
    
        if(rentalExist.rowCount<1){
            res.status(400).send('nao tem esse id no rentals')
        }


        const rental=await connection.query(
        `SELECT rentals."rentDate",rentals."daysRented",rentals."returnDate",games."pricePerDay"
        FROM rentals
        JOIN games
        ON games.id = rentals."gameId"
        WHERE rentals.id=$1`
        ,[id])

        const{rentDate,pricePerDay, daysRented,returnDate}=rental.rows[0];
    
        const dateNow = dayjs();
        const duration = dateNow.diff(rentDate, "day")
        let delayFee = null

        if(returnDate!=null){
            
            res.status(424).send('já foi devolvido')
            return
        }
    

        if(duration>daysRented){
            delayFee = (duration-daysRented)*pricePerDay
        }


        
        await connection.query(
        `UPDATE rentals 
         SET "returnDate" = NOW(), 
         "delayFee" = $1
         WHERE id = $2`
         ,[delayFee, id])
        res.status(200).send('Deu certo a devolucao')
    }
    catch(error){
        console.log(error)
    }

}