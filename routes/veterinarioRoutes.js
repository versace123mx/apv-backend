import express from 'express';
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword  } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();


//Area publica
router.post('/',registrar)

//le pasamos un parametro en este caso el token para confirmar
router.get('/confirmar/:token',confirmar)

router.post('/login',autenticar);

router.post('/olvide-password',olvidePassword)
router.get('/olvide-password/:token',comprobarToken)
router.post('/olvide-password/:token',nuevoPassword)
//Es lo mismo que arriba la misma url pero diferentes methodos
//router.post('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)


//Area privada
//esta ruta se esta protegiendo con el middleware, el middleware es algo en medio que primero se realiza y luego ya hace la otra accion por eso en el checkAuth 'middleware' coloco el next, que dice despues de hacer esta accion continua.
router.get('/perfil',checkAuth,perfil)
router.put('/perfil/:id',checkAuth,actualizarPerfil)
router.put('/actualizar-password',checkAuth,actualizarPassword)
export default router;