import {Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SessionDto} from "./sessions";

@Entity('treasures')
@Index('treasures_pos',  ["treasures.pos_x", "treasures.pos_y"], {unique: true})
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
