import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './playlist.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Song } from 'src/songs/song.entity';
import { error } from 'console';

@Injectable()
export class PlaylistsService {

  constructor(
    @InjectRepository(Playlist)
    private playListRepository: Repository<Playlist>,
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
    @InjectRepository(User)
    private userRepository: Repository<User>

  ) { }
  async create(createPlaylistDto: CreatePlaylistDto) {
    const playlist = new Playlist();
    playlist.name = createPlaylistDto.name;
    const songs = await this.songRepository.findBy({ id: In(createPlaylistDto.songs) });

    playlist.songs = songs;
    const user = await this.userRepository.findOneBy({ id: createPlaylistDto.user });
    if (user === null) {
      throw error("User not found!")
    }
    playlist.user = user;
    return this.playListRepository.save(playlist);


  }


  findAll() {
    return `This action returns all playlists`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
