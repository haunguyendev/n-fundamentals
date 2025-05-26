import { Injectable, Scope } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artist.entity';

@Injectable({
    scope: Scope.REQUEST,
})
export class SongsService {
    constructor(@InjectRepository(Song)
    private songRepository: Repository<Song>,
        @InjectRepository(Artist)
        private artistRepository: Repository<Artist>,
    ) {
    }

    async create(createSong: CreateSongDTO): Promise<Song> {
        const song = new Song();
        song.title = createSong.title;
        song.releasedDate = createSong.releasedDate;
        song.duration = createSong.duration;
        song.lyrics = createSong.lyrisc;
        const artists = await this.artistRepository.findBy({
            id: In(createSong.artists),
        });
        song.artists = artists;
        return await this.songRepository.save(song);
    }

    findAll(): Promise<Song[]> {
        return this.songRepository.find();

    }

    findOne(id: number): Promise<Song | null> {
        return this.songRepository.findOneBy({ id });
    }
    async delete(id: number): Promise<void> {
        await this.songRepository.delete(id);
    }

    async update(id: number, recordToUpdate: UpdateSongDto): Promise<UpdateResult> {
        return this.songRepository.update(id, recordToUpdate)
    }
    async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
        const queryBuilder = this.songRepository.createQueryBuilder('c');
        queryBuilder.orderBy('c.releasedDate', 'DESC');
        return paginate<Song>(this.songRepository, options)

    }



}
