import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePlaylistDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;
    @IsNumber()
    @IsNotEmpty()
    readonly user: number;
    @IsNumber({
    }, { each: true })
    readonly songs: number[];

}
