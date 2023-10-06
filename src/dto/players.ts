import {Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {SessionDto} from "./sessions";

@Entity('players')
@Index('player_pos',  ["userid", "posX", "posY"], {unique: true})
export class PlayersDto {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'user_id', unique: true})
    userid: number

    @ManyToOne((type) => SessionDto, (session) => session.id, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn()
    session: SessionDto

    @Column()
    avatar: string

    @Column({name: 'pos_x'})
    posX: number

    @Column({name: 'pos_y'})
    posY: number
}
