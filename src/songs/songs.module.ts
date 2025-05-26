import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { mock } from 'node:test';
import { connection } from 'src/common/constants/connection';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Artist } from 'src/artists/artist.entity';


const mockSongService = {
  findAll() {
    return [
      {
        id: 1,
        title: 'Song 1',
        artist: 'Artist 1',
      }];
  }
};

@Module({
  imports: [
    TypeOrmModule.forFeature([Song, Artist]) // Add your entities here
  ],
  controllers: [SongsController],
  providers: [
    SongsService,
    // {
    //   provide: SongsService,
    //   useValue: mockSongService,

    // }
    {
      provide: 'CONNECTION',
      useValue: connection
    }
  ]
})
export class SongsModule { }
