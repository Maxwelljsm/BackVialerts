import { Router } from "express";
import auth from "./auth";
import reserva from "./reserva";
import users from "./users";

const routes = Router();

routes.use('/auth', auth);
routes.use('/reserva', reserva);
routes.use('/users', users)
export default routes;