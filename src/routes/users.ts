import { Router } from "express";
import { UsuariosController } from "../controller/UsuariosController";


const router = Router();

router.get('/', UsuariosController.getAll);
router.get('/:id', UsuariosController.getById);
router.get('/encuesta/:id', UsuariosController.getByIdEncuesta);
router.put('/edit/:id', UsuariosController.editUser);

export default router;