import { Router } from "express";
import ReservaController from "../controller/ReservaController";

const router = Router();

router.get('/info/reserva/puesto/:id_puesto', ReservaController.getByIdPoss);
router.get('/reservas', ReservaController.getAll);
router.get('/:id', ReservaController.getById);
router.post('/crear_reserva', ReservaController.createReserva);
router.put('/actualizar_reserva/:id', ReservaController.editReserva);
router.put('/actualizar_reservastatus/:id', ReservaController.editReservastatus);
router.delete('/eliminar_reserva/:id', ReservaController.deleteReserva);

export default router;