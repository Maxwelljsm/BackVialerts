import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { Reserva } from "../entity/Reserva";

export class ReservaController {


    static getByIdPoss= async (request : Request, response : Response) => {
        const {id_puesto} = request.params;
        const reservaRepository = getRepository(Reserva);
        const regional = await reservaRepository.query(
        `select usuarios.email, puestos.id_puesto, puestos.descripcion, reserva.hora_incio, reserva.hora_fin, reserva.estado, reserva.createdAt, reserva.id_reserva
        from reserva inner join usuarios on reserva.usuario_id = usuarios.id_usuario
        inner join puestos on reserva.puesto_id = puestos.id_puesto
        where reserva.puesto_id = ${id_puesto}`);
        if (regional.length > 0) {
            response.send(regional);
        }else{
            response.status(404).json({message : 'Not Results'});
        }
    }

    static getAll = async (request : Request, response : Response) => {
        const reservaRepository = getRepository(Reserva);
        const regional = await reservaRepository.find();
        if (regional.length > 0) {
            response.send(regional);
        }else{
            response.status(404).json({message : 'Not Results'});
        }
    }

    static getById = async (request: Request, response: Response) => {
        const reservaRepository = getRepository(Reserva);
        const { id } = request.params;
        try {
            const regional = await reservaRepository.query(`select reserva.id_reserva, reserva.hora_incio , reserva.hora_fin,reserva.fecha_reserva,puestos.nombre as puesto_nombre, reserva.puesto_id, reserva.estado, tipo_puestos.id_tipoPuesto, tipo_puestos.nombre from reserva 
            inner join puestos on puestos.id_puesto = reserva.puesto_id
            inner join tipo_puestos on tipo_puestos.id_tipoPuesto = puestos.puestotipo_id 
            where usuario_id = ${id}`);
            response.send(regional);
        } catch (error) {
            response.status(404).json({ message: 'Not result' })
        }
    }

    static createReserva = async (request : Request, response : Response) => {

        const reservaRepository = getRepository(Reserva);
        const {hora_incio,hora_fin,fecha_reserva,usuario_id,puesto_id,estado}  = request.body;
        
        let reserva : Reserva = new Reserva();
        reserva.hora_incio = hora_incio;
        reserva.hora_fin = hora_fin;
        reserva.fecha_reserva = fecha_reserva;
        reserva.usuario_id = usuario_id;
        reserva.puesto_id = puesto_id;
        reserva.estado = estado;

        const validationOpt = { validationError : {target: false, value: false}};
        const errors = await validate(reserva, validationOpt);
        if (errors.length > 0) {
            response.status(400).json(errors);
        }

        try {
            reserva = await reservaRepository.save(reserva);

        } catch (error) {
            return response.status(409).json({error})
        }

        response.status(200).send({'Message':'Reserva Created'})
        
    }

    static editReserva = async (request: Request, response: Response) => {
        const reservaRepository = getRepository(Reserva);
        let reserva: Reserva;
        const { id } = request.params;
        const {hora_incio,hora_fin,fecha_reserva,usuario_id,puesto_id,estado}  = request.body;
        try {
            reserva = await reservaRepository.findOneOrFail(id);
        } catch (error) {
            return response.status(404).json({ message: 'Reserva not found' })
        }
        reserva.hora_incio = hora_incio;
        reserva.hora_fin = hora_fin;
        reserva.fecha_reserva = fecha_reserva;
        reserva.usuario_id = usuario_id;
        reserva.puesto_id = puesto_id;
        reserva.estado = estado;

        //Validate
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(reserva, validationOpt);

        if (errors.length > 0) {
            response.status(400).json(errors);
        }

        try {
            await reservaRepository.save(reserva);
        } catch (error) {
            return response.status(409).json({ message: 'Reserva already exist' })
        }

        response.status(200).send('Reserva update');

    };

    static deleteReserva = async (request: Request, response: Response) => {
        const reservaRepository = getRepository(Reserva);
        let reserva: Reserva;
        const { id } = request.params;
        try {
            reserva = await reservaRepository.findOneOrFail(id);
        } catch (error) {
            return response.status(404).json({ message: 'Reserva not found' })
        }

        // Remove Reserva
        reservaRepository.delete(id);
        response.status(200).send('Reserva deleted');

    };

    static editReservastatus = async (request: Request, response: Response) => {

        const reservaRepository = getRepository(Reserva);
        let reserva: Reserva;
        const { id } = request.params;
        const {estado} = request.body;
        try {
            reserva = await reservaRepository.findOneOrFail(id);
        } catch (error) {
            return response.status(404).json({ message: 'Possition not found' })
        }
        reserva.estado = estado;

        //Validate
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(reserva, validationOpt);

        if (errors.length > 0) {
            response.status(400).json(errors);
        }

        try {
            await reservaRepository.save(reserva);
        } catch (error) {
            return response.status(409).json({ message: 'Error cant create Poss' })
        }

        response.status(200).send("Reserva Actualizado");

    };

}

export default ReservaController;