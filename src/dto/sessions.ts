import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';


@Entity('sessions')
export class SessionDto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'background_img' })
    backgroundImg: string;

    @Column({ name: 'width' })
    width: number;

    @Column({ name: 'height' })
    height: number;

}
