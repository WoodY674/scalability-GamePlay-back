import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SessionDto} from "./sessions";

@Entity('treasures')
export class TreasuresDto {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne((type) => SessionDto, (session) => session.id, { eager: true })
    @JoinColumn()
    session: SessionDto;

    @Column({ name: 'pos_x' })
    posX: number;

    @Column({ name: 'pos_y' })
    posY: number;

    @Column({ name: 'is_claim' })
    isClaim: boolean = false;
}