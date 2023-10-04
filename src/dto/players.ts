import {Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {SessionDto} from "./sessions";

@Entity('players')
@Index('player_pos',  ["players.pos_x", "players.pos_y"], {unique: true})
export class PlayersDto {
    @PrimaryGeneratedColumn()
    id: number

    @Column({name: 'user_id'})
    userid: number

    @ManyToOne((type) => SessionDto, (session) => session.id, { eager: true })
    @JoinColumn()
    session: SessionDto

    @Column()
    avatar: string

    @Column({name: 'pos_x'})
    posX: number

    @Column({name: 'pos_y'})
    posY: number
}
