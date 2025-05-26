import { IsArray, IsDateString, IsMilitaryTime, IsOptional, IsString } from "class-validator";

export class UpdateSongDto {

    @IsString()
    @IsOptional()
    readonly title: string;
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly artist: string[];
    @IsOptional()
    @IsDateString()
    readonly releasedDate: Date;
    @IsOptional()
    @IsMilitaryTime()
    readonly duration: Date;
    @IsOptional()
    @IsString()
    readonly lyrics: string;
}