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
        console.log(customers)
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

    console.log(customerExist)

    if(customerExist.length===0){
        res.status(404).send('Usuario não existe ')
        return
    }
    
    res.status(200).send(customerExist[0])
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


    const {rows:cpfExist} = await connection.query(
    `SELECT * FROM customers
     WHERE customers.cpf = $1
    `,[cpf]
    )

    console.log(cpfExist)

    if(cpfExist.length>0){
        res.status(409).send('Não foi possivel fazer o cadastro verifique as informacoes passadas ')
        return
    }
    


    await connection.query(
    `INSERT INTO customers (name,phone,cpf,birthday) 
     VALUES ($1,$2,$3,$4)
    `,[name,phone,cpf,updatedUser.birthday] 
    )

    res.status(200).send('oii funfou viu?')
}

export async function updateCostumer(req, res){

    const idCustomer = req.params.id
    const customer = req.body
    const {name, phone, cpf, birthday} = req.body

    const customerValid = customerSchema.validate(customer)

    if(customerValid.error){
        res.status(400).send('erro no body da request')
        return
    }

    const {rows:customerExist} = await connection.query(
        `SELECT * FROM customers
         WHERE customers.cpf = $1
        `,[customer.cpf]
    )

    if(customerExist.length===0){
        console.log('nao existe user com esse cpf pra atualizar ')
        res.status(409).send('usuario nao existe ')
        return
    }

    await connection.query(
    `UPDATE customers
     SET name=$1 , phone=$2, cpf=$3, birthday=$4
     WHERE id = $5
    `,
    [name, phone,cpf, birthday, idCustomer]
    )

    res.status(200).send('atualizou com sucesso ')
}