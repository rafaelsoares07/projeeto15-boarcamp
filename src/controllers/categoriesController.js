import connection from "../dbStrategy/database.js";
import { createCategorySchema } from "../schemas/createCategorySchema.js";

export async function createCategory(req, res){

    try{

        const category = req.body

        const categoryValid = createCategorySchema.validate(category)
        
        if(categoryValid.error){
            
            res.status(400).send("Campo de nome deve ser preenchido")
            return
        }

        const categoryExist = await connection.query(
            `SELECT * FROM categories 
            WHERE categories.name = $1`, 
            [category.name] 
        );
        
        //rowsCount é uma propiedade do objeto do banco de daos que diz se tem alguma linha na tabela
        if(categoryExist.rowCount>0){
            res.status(409).send('Categoria já existe escolha outro nome ')
            return
        }
        
        connection.query('INSERT INTO categories (name) VALUES ($1)',[category.name])
        res.status(201).send('Criado com sucesso ')
    }
    catch(error){

        console.log(error)
        
    }

}

export async function listCategories(req, res){

    try{
        const {rows:categories} = await connection.query(`SELECT * FROM categories`)
        res.status(200).send(categories)
    }
    catch(error){
        console.log(error)
    }
}