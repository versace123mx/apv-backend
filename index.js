import express from "express";
import conectarDB from "./config/db.js";
import dotenv from 'dotenv';
import veterinarioRoutes from './routes/veterinarioRoutes.js'; //dice juanpablo que no es necesario que tenga el nombre del export default que seria router
import pacienteRoutes from './routes/pacienteRoutes.js'; //dice juanpablo que no es necesario que tenga el nombre del export default que seria router
import cors from 'cors'

dotenv.config();//este desde que carga el index localiza las variables de entorno y las pone globales, por eso es que se puede utilizar de esta manera

//Extendemos de express
const app = express();

//Habilitar el uso de json para que express lea los datos que le pasamos en json
app.use(express.json());

//Conexion a la base de datos
conectarDB();


//Asemos uso de cors para solo permitir ciertos dominios se conecten a nuestra API
const dominiosPermitidos = [process.env.URL_CONFIRMAR];
const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1){
            callback(null, true)
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}
app.use(cors(corsOptions))



//habilitamos el routing principal, que se encargara de mapear todos los endpoint de veterinaria
app.use('/api/veterinarios', veterinarioRoutes);

//habilitamos el routing principal, que se encargara de mapear el routing de pacientes (endpoint)
app.use('/api/pacientes', pacienteRoutes);

//Aqui declaramos el puerto, en nuestro caso process.env.PORT en el archivo .env no existe, por lo cual se le asigna 400, pero cuando se haga deploy si existe por lo cual PORT tomara el valor y lo asignara al puerto
const PORT = process.env.PORT || 4000

//Definimos la conexion al servidor
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});