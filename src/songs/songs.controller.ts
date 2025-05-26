import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Inject, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO } from './dto/create-song-dto';
import { Song } from './song.entity';
import { Connection } from 'src/common/constants/connection';
import { UpdateSongDto } from './dto/update-song.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { JwtArtistGuard } from 'src/auth/jwt-artist.guard';

@Controller('songs')
export class SongsController {

    constructor(private readonly songsService: SongsService,
        @Inject('CONNECTION') private connection: Connection
    ) {
        console.log(`THIS IS THE CONNECTION: ${this.connection.CONNECTION_STRING}`);

    }

    @Post()
    @UseGuards(JwtArtistGuard)
    async create(@Body() createSongDTO: CreateSongDTO): Promise<Song> {
        return this.songsService.create(createSongDTO);
    }





    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Song | null> {
        return this.songsService.findOne(id);
    }
    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number,
        @Body() recordToUpdate: UpdateSongDto) {
        return this.songsService.update(id, recordToUpdate);
    }

    @Delete(':id')
    delete(
        @Param('id', ParseIntPipe) id: number
    ): Promise<void> {
        return this.songsService.delete(id);
    }

    @Get()
    findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10): Promise<Pagination<Song>> {
        limit = limit > 100 ? 100 : limit
        return this.songsService.paginate({
            page, limit
        })
    }







}
