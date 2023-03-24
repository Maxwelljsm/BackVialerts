import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { Usuarios } from "../entity/Usuarios";

export class UsuariosController {

    static getAll = async (request: Request, response: Response) => {
        const userRepository = getRepository(Usuarios);
        const users = await userRepository.find();
        if (users.length > 0) {
            response.send(users);
        } else {
            response.status(404).json({ message: 'Not result' });
        }
    }

    static getById = async (request: Request, response: Response) => {
        const userRepository = getRepository(Usuarios);
        const { id } = request.params;
        try {
            const usuarios = await userRepository.findOneOrFail(id);
            usuarios.password = null;
            response.send(usuarios);
        } catch (error) {
            response.status(404).json({ message: 'Not result' })
        }
    }

    static getByIdEncuesta = async (request: Request, response: Response) => {
        const userRepository = getRepository(Usuarios);
        const { id } = request.params;
        try {
            const usuarios = await userRepository.query(`select encuesta_cv.question, encuesta_cv.id_encuesta, encuesta_cv.updatedAt from usuarios
            inner join encuesta_cv on usuarios.id_usuario = encuesta_cv.usuario_id
            where id_usuario=${id} `);
            usuarios.password = null;
            response.send(usuarios[0]);
        } catch (error) {
            response.status(404).json({ message: 'Not result' })
        }
    }


    static editUser = async (request: Request, response: Response) => {
        const userRepository = getRepository(Usuarios);
        let usuarios: Usuarios;
        const { id } = request.params;
        const { email, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, regional, tipo, estado} = request.body;
        try {
            usuarios = await userRepository.findOneOrFail(id);
        } catch (error) {
            return response.status(404).json({ message: 'User not found' })
        }
        usuarios.email = email;
        usuarios.primer_nombre = primer_nombre;
        usuarios.segundo_nombre = segundo_nombre;
        usuarios.primer_apellido = primer_apellido;
        usuarios.segundo_apellido = segundo_apellido;
        usuarios.regional = regional;
        usuarios.tipo = tipo;
        usuarios.estado = estado;

        //Validate
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(usuarios, validationOpt);

        if (errors.length > 0) {
            response.status(400).json(errors);
        }

        try {
            await userRepository.save(usuarios);
        } catch (error) {
            return response.status(409).json({ message: 'Username already exist' })
        }

        response.status(200).send("User Updated");

    };
    
    static deleteUser = async (request: Request, response: Response) => {
        const userRepository = getRepository(Usuarios);
        let usuarios: Usuarios;
        const { id } = request.params;
        const { email } = request.body;
        try {
            usuarios = await userRepository.findOneOrFail(id);
        } catch (error) {
            return response.status(404).json({ message: 'Proveedor not found' })
        }

        // Remove cliente
        userRepository.delete(id);
        response.status(200).send('user deleted');

    };
}
