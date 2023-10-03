import {Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {SessionDto} from "./sessions";

@Entity('players')
@Index('player_pos',  ["players.pos_x", "players.pos_y"], {unique: true})
export class PlayersDto {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @ManyToOne((type) => SessionDto, (session) => session.id, { eager: true })
    @JoinColumn()
    session: SessionDto

    @Column()
    avatar: string

    @CreateDateColumn({name: 'pos_x'})
    posX: number

    @CreateDateColumn({name: 'pos_y'})
    posY: number
}
