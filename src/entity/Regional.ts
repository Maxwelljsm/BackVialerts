import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";

@Entity()
export class Regional {
    @PrimaryGeneratedColumn()
    id_regional: number;

    @Column()
    nombre_regional: string;

    @Column()
    image_regional: string;

    @Column()
    descripcion: string;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}