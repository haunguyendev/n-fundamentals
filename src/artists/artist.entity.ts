import { Entity, ForeignKey, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/user.entity";
import { Song } from "src/songs/song.entity";

@Entity('artists')
export class Artist {
    @PrimaryGeneratedColumn()
    id: number;
    userId: number;
    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @ManyToMany(() => Song, (song) => song.artists)
    songs: Song[]
}