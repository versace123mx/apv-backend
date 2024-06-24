import mongoose from 'mongoose';

const conectarDB = async () => {
    try{
        const db = await mongoose.connect(process.env.DB_CONEXION);
        const url = `${db.connection.host}:${db.connection.port}`
        console.log(`Mongo db conectado en ${url}`)
    }catch(error){
        console.log('error de conexion',error.message);
        process.exit(1);
    }
}

export default conectarDB;