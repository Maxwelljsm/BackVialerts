import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany, TableForeignKey, JoinColumn, ManyToOne } from "typeorm";
import * as bcrypt from "bcryptjs";
import { IsEmail } from "class-validator";
import { Regional } from "./Regional";

@Entity()
@Unique(['email'])
export class Usuarios {

    @PrimaryGeneratedColumn()
    id_usuario: number;

    @Column()
    tipo: string;

    @Column()
    primer_nombre: string;

    @Column()
    segundo_nombre: string;

    @Column()
    primer_apellido: string;

    @Column()
    segundo_apellido: string;

    @ManyToOne(() => Regional, (Regional) => Regional.id_regional,{cascade: false}) @JoinColumn({name: 'regional', referencedColumnName: 'id_regional'})
    @Column()
    regional: number;

    @Column()
    @IsEmail()
    email: string;

    @Column()
    password: string;

    @Column()
    estado: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(password: string): boolean {
        return bcrypt.compareSync(password, this.password);
    }

}