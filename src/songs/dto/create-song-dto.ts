import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSongDTO {
    @IsString()
    @IsNotEmpty()
    readonly title: string;
    @IsNotEmpty()
    @IsArray()
    //@IsString({ each: true })
    @IsNumber({}, { each: true })
    readonly artists: number[];
    @IsNotEmpty()
    @IsDateString()
    readonly releasedDate: Date;
    @IsMilitaryTime()
    @IsNotEmpty()
    readonly duration: Date;
    @IsString()
    @IsOptional()
    readonly lyrisc: string;
}