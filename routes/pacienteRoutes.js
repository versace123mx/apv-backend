import express from 'express';
import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacientesController.js';
import checkAuth from '../middleware/authMiddleware.js';
const router = express.Router();

/*
router.route('/')
    .post(agregarPaciente)
    .get(obtenerPacientes)
*/

router.post('/',checkAuth,agregarPaciente)
router.get('/',checkAuth,obtenerPacientes)

//le ponemos un id para que cuando se acceda a la ruta /api/pacientes/id  leamos el id que traemos en la url
/*
esto es lo mismo de lo que esta abajo solo que a mi se me hace mas limpio ponerlo uno por uno
router.route(':id')
        .get(checkAuth,obtenerPaciente)
        .put(checkAuth,actualizarPaciente)
        .delete(checkAuth,eliminarPaciente)
*/
router.get('/:id',checkAuth,obtenerPaciente)
router.put('/:id',checkAuth,actualizarPaciente)
router.delete('/:id',checkAuth,eliminarPaciente)


export default router;