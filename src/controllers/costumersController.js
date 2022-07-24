import connection from "../dbStrategy/database.js";

import { customerSchema } from "../schemas/customerSchema.js";


export async function listCustomers(req, res){

    const {cpf} = req.query
    
    if(cpf){
        const {rows:costumersSeach} = await connection.query(
            `SELECT * FROM customers 
             WHERE customers.cpf ILIKE $1 || '%'
            `,
            [cpf]
        )
        res.status(200).send(costumersSeach)
        return
    }

    else{
        const {rows:customers} = await connection.query(`SELECT * FROM customers`)
        res.status(200).send(customers)
        return
    }

    
}

export async function listCustomerById(req, res){
    const idCustomer =  req.params.id

    const {rows:customerExist} = await connection.query(
    `SELECT * FROM customers
     WHERE customers.id = ${idCustomer}
    `
    )

    if(customerExist.length===0){
        res.status(404).send('Usuario não existe ')
        return
    }
    
    res.status(200).send(customerExist)
}

export async function insertCostumer(req, res){

    const user = req.body
    const {name,phone,birthday,cpf}=req.body

    const date = [birthday[4],birthday[5],birthday[6],birthday[7],birthday[2],birthday[3],birthday[0],birthday[1]]
    const updatedUser = {...user, birthday:date.join('')}
    

    
    const userValid = customerSchema.validate(updatedUser)
    if(userValid.error){
        console.log(userValid.error)
        res.status(400).send('campos devem ser preenchidos corretamente')
        return
    }

    




    await connection.query(
    `INSERT INTO customers (name,phone,cpf,birthday) 
     VALUES ($1,$2,$3,$4)
    `,[name,phone,cpf,updatedUser.birthday] 
    )



    res.status(222).send('oii funfou viu?')
}