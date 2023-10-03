import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm'
import {Session} from "inspector";
import {SessionDto} from "./sessions";

@Entity('players')
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
