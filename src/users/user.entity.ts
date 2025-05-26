import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Playlist } from "src/playlists/playlist.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @ApiProperty({
        example: 'Jane',
        description: "Provide the first name of the user"
    })
    @Column()
    firstName: string;
    @Column()
    @ApiProperty({
        example: 'Doe',
        description: "Provide the last name of the user"
    })
    lastName: string;
    @ApiProperty({
        example: "jan_doe@gmail.com",
        description: " Provide the email of the user"
    })
    @Column({ unique: true })
    email: string;
    @Column()
    @Exclude()
    @ApiProperty({
        example: "test123@#",
        description: "Provide the password of the user"
    })
    password: string;
    @Column({ nullable: true })
    twoFASecret: string;
    @Column()
    apiKey: string;
    @Column()
    phone: string;
    @Column({ default: false, type: 'boolean' })
    enable2FA: boolean;
    @OneToMany(() => Playlist, (playlist) => playlist.user)
    playlists: Playlist[];

}