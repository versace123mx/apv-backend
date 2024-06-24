import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarID from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";


//res es la respuesta del servidor
//req es la solicitud del cliente
//res.send envia respuestas al navegador
//req.query es para obtener los datos de la solicitud
//req.body es para obtener los datos del formulario
//res.json le estamos pasando una respuesta tipo objeto que es lo que entregara el api respuestas json
//req.params leer datos de la url


//Ejemplo de respuesta al navegador normal
/*
const registrar = (req, res) =>{
    res.send({url:'hola desd el home'});
}
*/

const registrar = async (req, res) => {
    const { nombre, email } = req.body;

    //Revisar si ya existe el email con findOne y solo se le pasa email por que el objeto como el resultado el key es email
    const existeUsuario = await Veterinario.findOne({ email });
    if(existeUsuario){
        const error = new Error("Usuario ya ha sido registrado con este email")
        return res.status(400).json({ msg: error.message });
    }

    try{
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();
        emailRegistro({
            nombre,
            email,
            token :veterinarioGuardado.token
        });//Enviar Email
        res.json({msg:'Registrando Usuario, Confirma tu usuario',data:veterinarioGuardado});
    }catch(e){
        console.log(e);
    }
}
const perfil = (req, res) => {
    const { veterinario} = req;
    res.json(veterinario);
}

const confirmar = async (req, res) => {
    const { token } = req.params;//obtenemos el token que se paso via parametro
    const usuarioConfirmar = await Veterinario.findOne({ token });//verificamos si hay un token con esa coincidencia
    if(!usuarioConfirmar){
        const error = new Error('Token no valido')
        return res.status(404).json({ msg:error.message });//el message es necesario si no entonces no aparece respuesta en el json
    }
    try{
        //Despues de verificar el token valido
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = null;
        await usuarioConfirmar.save();
        res.json({msg:'cuenta confirmada..'});
    }catch(error){
        console.log(error);
    }

}

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //verificar si el usuario existe
    const usuario = await Veterinario.findOne({ email });
    if( !usuario ){
        const error = new Error('El usuario no existe')
        return res.status(404).json({ msg:error.message });//el message es necesario si no entonces no aparece respuesta en el json
    }

    //Comprobar si el usuario esta confirmado
    if( !usuario.confirmado ){
        const error = new Error('Tu cuenta no ha sido confirmada')
        return res.status(403).json({ msg:error.message });//el message es necesario si no entonces no aparece respuesta en el json
    }

    //Revisar el password
    if( await usuario.comprobarPassword(password) ){
        //Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    }else{
        const error = new Error('El password es incorrecto')
        return res.status(403).json({ msg:error.message });//el message es necesario si no entonces no aparece respuesta en el json
    }

    //console.log(req.body)
}

const olvidePassword = async (req, res) =>{
    const { email } = req.body

    const existeVeterinario = await Veterinario.findOne({ email });
    if(!existeVeterinario){
        const error = new Error("El usuario no Existe")
        return res.status(400).json({ msg: error.message });
    }

    try {
        //existeVeterinario.confirmado = false;
        existeVeterinario.token = generarID();
        await existeVeterinario.save();

        //Enviar Email con instrucciones para restablecer contraseña
        emailOlvidePassword({
            nombre: existeVeterinario.nombre,
            email,
            token: existeVeterinario.token
        });
        res.json({msg:'Hemos enviado un email con las instrucciones..'});
    } catch (error) {
        console.log(error)
    }
}
const comprobarToken = async (req, res) =>{
    const { token } = req.params;
    const existeVeterinario = await Veterinario.findOne({ token });
    if(existeVeterinario){
        //El Token es valido el usuario existe
        res.json({msg: "Token valido y el usuario existe"})
    }else{
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message });
    }
}
const nuevoPassword = async (req, res) =>{

    const { token } = req.params;
    const { password } = req.body;
    const veterinario = await Veterinario.findOne({ token });

    if(!veterinario){
        const error = new Error("Hubo un error");
        return res.status(404).json({ msg: error.message });
    }

    try {
        veterinario.token = null;
        //veterinario.confirmado = true;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password Modificado Correctamente"})
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }
}

const actualizarPerfil = async (req, res) => {

    const veterinario =  await Veterinario.findById(req.params.id)

    if(!veterinario){
        const error = new Error("No existe el veterinario");
        return res.status(400).json({msg:error})
    }

    const {email} = req.body
    if(veterinario.email != req.body.email){
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            return res.status(400).json({msg:'Email ya esta en uso, ingresa otro'})
        }
    }

    try{
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email
        veterinario.web = req.body.web
        veterinario.telefono = req.body.telefono

        const veterinarioActualizado = await veterinario.save()
        res.status(200).json(veterinarioActualizado)
    }catch(error){
        return res.status(404).json({ msg: error.message });
    }

}

const actualizarPassword = async (req, res) =>{
    const { _id } = req.veterinario
    const { pwd_actual, pwd_nuevo } = req.body

    const veterinario =  await Veterinario.findById(_id)
    if(!veterinario){
        const error = new Error("No existe el veterinario");
        return res.status(400).json({msg:error})
    }

    //Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.status(200).json({msg:"Password actualizado correctamente"})
    }else{
        const error = new Error("El Password Actual es incorrecto");
        return res.status(400).json({msg:error.message})
    }

}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}