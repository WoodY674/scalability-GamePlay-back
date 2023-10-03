import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';


@Entity('sessions')
export class SessionDto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'background_img' })
    backgroundImg: string;

    @Column({ name: 'scale_x' })
    scaleX: number;

    @Column({ name: 'scale_y' })
    scaleY: number;

}
