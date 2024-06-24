import mongoose from "mongoose";

//Creamos el Schema
const pacientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    propietario:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now
    },
    sintomas:{
        type: String,
        required: true
    },
    veterinario:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinaria',
    }

},{
    timestamps: true,
})

//Creamos el modelo dentro colocamos el nombre de la coleccion y le pasamos el schema
const Paciente = mongoose.model('Paciente',pacientesSchema);

//Exportamos el modelo
export default Paciente;