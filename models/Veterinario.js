import mongoose from "mongoose";
import generarID from "../helpers/generarId.js";
import bcrypt from "bcrypt";

//Creamos el schema de la base de datos
const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono:{
        type: String,
        default: null,
        trim: true
    },
    web:{
        type: String,
        default: null
    },
    token:{
        type: String,
        default: generarID()
    },
    confirmado:{
        type:Boolean,
        default:false
    }
});

//Creamos un middleware para hashear la contraseña
veterinarioSchema.pre('save', async function(next){

    //Si el password ya esta haseado no lo vuelvas a hasear
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

//Esta funcion compara el password que se envia y el password que tiene el usuario
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password)
};


const Veterinaria = mongoose.model("Veterinaria",veterinarioSchema);

export default Veterinaria;