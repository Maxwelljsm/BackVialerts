import { getRepository } from "typeorm";
import { Request, Response } from "express";
import { validate } from "class-validator";
import { Regional } from "../entity/Regional";

export class RegionalController {

    static getInfo= async (request : Request, response : Response) => {
        const regionalRepository = getRepository(Regional);
        const regional = await regionalRepository.query(`
            select regional.nombre_regional, tipo_oficina.nombre, 
            count(puestos.id_puesto) as total_puestos,
            count(case puestos.estado when "Disponible" then 1 else null end) as puestos_disponibles,
            count(case puestos.estado when "Reservado" then 1 else null end) as puestos_reservados,
            count(case puestos.estado when "Inactivo" then 1 else null end) as puestos_bloqueados
            from oficina 
            inner join regional on oficina.regional_id = regional.id_regional
            inner join puestos on oficina.id_oficina = puestos.oficina_id
	        inner join tipo_oficina on oficina.oficinatipo_id = tipo_oficina.id_tipoOficina
            group by oficina.id_oficina 
            order by regional.nombre_regional`);
        if (regional.length > 0) {
            response.send(regional);
        }else{
            response.status(404).json({message : 'Not Results'});
        }
    }

    static getAll = async (request : Request, response : Response) => {
        const regionalRepository = getRepository(Regional);
        const regional = await regionalRepository.find();
        if (regional.length > 0) {
            response.send(regional);
        }else{
            response.status(404).json({message : 'Not Results'});
        }
    }
    static getAllRP = async (request : Request, response : Response) => {
        const regionalRepository = getRepository(Regional);
        const regional = await regionalRepository.query(`
            select regional.id_regional, regional.nombre_regional, regional.image_regional, regional.descripcion, 
            count(case puestos.estado when "Disponible" then 1 else null end) as disponibles,
            count(case puestos.estado when "Reservado" then 1 else null end) as reservados,
            count(case puestos.estado when "Inactivo" then 1 else null end) as inactivos,
            count(case puestos.estado when "Ocupado" then 1 else null end) as ocupados
            from oficina 
            inner join regional on oficina.regional_id = regional.id_regional
            inner join puestos on oficina.id_oficina = puestos.oficina_id
            inner join tipo_oficina on oficina.oficinatipo_id = tipo_oficina.id_tipoOficina
            group by oficina.regional_id 
            order by regional.nombre_regional 
        `);
        if (regional.length > 0) {
            response.send(regional);
        }else{
            response.status(404).json({message : 'Not Results'});
        }
    }

    static getById = async (request: Request, response: Response) => {
        const regionalRepository = getRepository(Regional);
        const { id } = request.params;
        try {
            const regional = await regionalRepository.findOneOrFail(id);
            regional.id_regional = null;
            response.send(regional);
        } catch (error) {
            response.status(404).json({ message: 'Not result' })
        }
    }

    static createRegional = async (request : Request, response : Response) => {

        const regionalRepository = getRepository(Regional);
        const {nombre_regional, image_regional, descripcion}  = request.body;
        
        let regional : Regional = new Regional();
        regional.nombre_regional = nombre_regional;
        regional.image_regional = image_regional;
        regional.descripcion = descripcion;

        //Validate
        const validationOpt = { validationError : {target: false, value: false}};
        const errors = await validate(regional, validationOpt);
        if (errors.length > 0) {
            response.status(400).json(errors);
        }

        try {
            regional = await regionalRepository.save(regional);
        } catch (error) {
            return response.status(409).json({error})
        }

        response.status(200).send('Regional Created')
        
    }

}

export default RegionalController;