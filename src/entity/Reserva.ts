import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Usuarios } from "./Usuarios";

@Entity()
export class Reserva {
    @PrimaryGeneratedColumn()
    id_reserva: number;

    @Column()
    @CreateDateColumn()
    hora_incio: Date;

    @Column()
    @CreateDateColumn()
    hora_fin: Date;

    @Column()
    @CreateDateColumn()
    fecha_reserva: Date;

    @ManyToOne(() => Usuarios, (Usuarios) => Usuarios.id_usuario, {cascade: false}) @JoinColumn({name : 'usuario_id', referencedColumnName : 'id_usuario'})
    @Column()
    usuario_id: number;

    @Column()
    estado: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}