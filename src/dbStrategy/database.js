import pg from 'pg';
import dotenv from "dotenv"
dotenv.config()

const {Pool} = pg;

console.log('data base aqui')
const connection = new Pool({ connectionString: process.env.DATABASE_URL});

export default connection;