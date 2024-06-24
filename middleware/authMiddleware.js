import jwt from 'jsonwebtoken';
import Veterinaria from '../models/Veterinario.js';

const checkAuth = async (req, res, next) => {
    let token;

    //en esta primer validacion se valida que exista y que contenga la palabra bearer que es el tipo de autenticacion
    if( req.headers.authorization && req.headers.authorization.startsWith('Bearer')){

        try{
            token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token,process.env.JWT_SECRET); //comprueba el token sea valido

            //Guardamos en session del request para que cuando lo pase al siguiente metodo ya no se consulte nuevamente a la base de datos
            req.veterinario = await Veterinaria.findById(decode.id).select("-password -token -confirmado");
            return next();
        }catch(e){
            const error = new Error("Token no valido");
            return res.status(403).json({ msg: error.message });
        }
    }

    //Si no hay token entonces devolvemos el error
    if(!token){
        const error = new Error("Token no valido o inexistente");
        res.status(403).json({ msg: error.message });
    }

    next();
}

export default checkAuth;