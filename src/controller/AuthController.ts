import { getRepository } from "typeorm";
import { Request, Response } from "express";
import config from "./../config/config";
import * as jwt from "jsonwebtoken";
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { validate } from "class-validator";
import { Usuarios } from "../entity/Usuarios";
/* 
*Author: Jaider Steven Mazabuel Muñoz
*Email: jmazabuel@qvision.com.co
*Descripcion: Controlador de usuario aqui se encuentras todas 
              las funciones en cuestion del ingreso y registro
              social y natural de usuario.
*Fecha de creacion: 22/05/2022
*Fecha de modificacion: 22/05/2022
*/
class AuthController {
    static login = async (request: Request, response: Response) => {
        const { email, password } = request.body;

        if (!(email && password)) {
            return response.status(400).json({ message: 'Username & password are required!' });
        }

        const userRepository = getRepository(Usuarios);

        let usuarios: Usuarios;

        try {
            usuarios = await userRepository.findOneOrFail({ where: { email } })
        } catch (e) {
            return response.status(400).json({ message: 'Username or password incorrect!' })
        }

        if (!usuarios.checkPassword(password))
            return response.status(400).json({ message: 'Username or password incorrect!' })

        const token = jwt.sign({ userId: usuarios.id_usuario, email: usuarios.email }, config.jwtSecret, { expiresIn: '1h' });
        response.send({ message: 'OK', 
                        id_usuarios: usuarios.id_usuario, 
                        tipo: usuarios.tipo,
                        primer_nombre: usuarios.primer_nombre, 
                        segundo_nombre: usuarios.segundo_nombre, 
                        primer_apellido: usuarios.primer_apellido, 
                        segun_apellido: usuarios.segundo_apellido, 
                        regional: usuarios.regional,
                        email: usuarios.email, 
                        estado: usuarios.estado,
                        token: token });

    }

    static verify = async (idToken: any) => {
        const CLIENT_ID = "459267423423-bsj9e152oqnngsdiu7rm53r7mpabf0lh.apps.googleusercontent.com";
        const client = new OAuth2Client(CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: CLIENT_ID
        })

        const payload = ticket.getPayload();
        return payload;
    }

    static loginSocial = async (request: Request, response: Response) => {
        const userRepository = getRepository(Usuarios);
        let usuarios: Usuarios; 
        const { idToken } = request.params;
        this.verify(idToken).then(async (payload: TokenPayload) => {
            usuarios = await userRepository.findOne({ where: { email: payload.email } });
            if (!usuarios) {
                usuarios = new Usuarios();
                usuarios.email = payload.email;
                usuarios.primer_nombre = payload.name;
                usuarios.password = "";
                usuarios = await userRepository.save(usuarios);
            }

            const token = jwt.sign({ userId: usuarios.id_usuario, email: usuarios.email }, config.jwtSecret, { expiresIn: '1h' });
            return response.send({ message: 'OK',
                                    idusuarios: usuarios.id_usuario, 
                                    tipo: usuarios.tipo,
                                    primer_nombre: usuarios.primer_nombre, 
                                    segundo_nombre: usuarios.segundo_nombre, 
                                    primer_apellido: usuarios.primer_apellido, 
                                    segun_apellido: usuarios.segundo_apellido, 
                                    regional: usuarios.regional,
                                    email: usuarios.email, 
                                    estado: usuarios.estado,
                                    token: token });
        }).catch(error => {
            console.log(error);
            return response.status(404).json({ message: 'error' })
        });
    };

    static register = async (request: Request, response: Response) => {
        const userRepository = getRepository(Usuarios);
        const { email, password, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, tipo, estado, regional } = request.body;

        let usuarios: Usuarios = new Usuarios();

        usuarios.email = email;
        usuarios.password = password;
        usuarios.primer_nombre = primer_nombre;
        usuarios.segundo_nombre = segundo_nombre;
        usuarios.primer_apellido = primer_apellido;
        usuarios.segundo_apellido = segundo_apellido;
        usuarios.tipo = tipo;
        usuarios.estado = estado;
        usuarios.regional = regional;

        //Validate
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(usuarios, validationOpt);
        if (errors.length > 0) {
            response.status(400).json(errors);
        }

        try {
            usuarios.hashPassword();
            usuarios = await userRepository.save(usuarios);
        } catch (error) {
            return response.status(409).json({ message: 'Username already exist' })
        }

        usuarios.password = null;

        const token = jwt.sign({ userId: usuarios.id_usuario, email: usuarios.email }, config.jwtSecret, { expiresIn: '1h' });
        return response.send({ message: 'OK',  
                                id_usuarios: usuarios.id_usuario, 
                                tipo: usuarios.tipo,
                                primer_nombre: usuarios.primer_nombre, 
                                segundo_nombre: usuarios.segundo_nombre, 
                                primer_apellido: usuarios.primer_apellido, 
                                segun_apellido: usuarios.segundo_apellido, 
                                regional: usuarios.regional,
                                email: usuarios.email, 
                                estado: usuarios.estado,
                                token: token });
    };
}

export default AuthController;