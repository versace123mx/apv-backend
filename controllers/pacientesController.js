import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    //console.log(req.body)
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json({
            nombre: pacienteAlmacenado.nombre,
            propietario: pacienteAlmacenado.propietario,
            email:pacienteAlmacenado.email,
            fecha:pacienteAlmacenado.fecha,
            sintomas: pacienteAlmacenado.sintomas,
            id: pacienteAlmacenado._id
        });
    } catch (error) {
        console.log(error)
    }
    //console.log(paciente)
}
const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);

    res.json(pacientes);
}
const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if( !paciente ){
        return res.status(404).json({msg: 'No encontrado'})
    }

    //req.veterinario._id biene de lo que se trae desde el middleware
    if ( paciente.veterinario._id.toString() !== req.veterinario._id.toString() ) {
        return res.json({msg: 'Accion no valida'})
    }

    res.json(paciente);

}
const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if( !paciente ){
        return res.status(404).json({msg: 'No encontrado'})
    }

    //req.veterinario._id biene de lo que se trae desde el middleware, comprobamos que el veterinario sea el mismo que tien asignado el paciente
    if ( paciente.veterinario._id.toString() !== req.veterinario._id.toString() ) {
        return res.json({msg: 'Accion no valida'})
    }

    //Actualizar Paciente, en caso de que no venga un campo desde el formualrio, entonces que le guarde el nombre que traia por default
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar paciente" });
    }
}
const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if( !paciente ){
        return res.status(404).json({msg: 'No encontrado'})
    }

    //req.veterinario._id biene de lo que se trae desde el middleware, comprobamos que el veterinario sea el mismo que tien asignado el paciente
    if ( paciente.veterinario._id.toString() !== req.veterinario._id.toString() ) {
        return res.json({msg: 'Accion no valida'})
    }

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente eliminado'})
    } catch (error) {
        console.log(error)
    }
}
export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}