import { MiddlewareConsumer, Module, NestModule, ParseIntPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import { DevConfigService } from './common/providers/DevConfigService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Type } from 'class-transformer';
import { Song } from './songs/song.entity';
import { Artist } from './artists/artist.entity';
import { User } from './users/user.entity';
import { PlaylistsModule } from './playlists/playlists.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { Playlist } from './playlists/playlist.entity';
import { dataSourceOptions, typeOrmAsyncConfig } from '../db/data-source';
import { SeedModule } from './seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';
import { ApiKeyMiddleware } from './common/middlewares/api-key.middleware';
const devConfig = {
  port: 3000,
};
const proConfig = {
  port: 4000,
}
@Module({
  imports: [ConfigModule.forRoot({

    isGlobal: true,
    envFilePath: ['.development.env', '.production.env', '.env'],
    load: [configuration],
    validate: validate
  }),
  TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
  TypeOrmModule.forFeature([Song, Artist, User, Playlist, User]),

    SongsModule,
    PlaylistsModule,
    UsersModule,
    AuthModule,
    ArtistsModule,
    SeedModule // Add your entities here
  ],
  controllers: [AppController],
  providers: [AppService,
    DevConfigService,
    {
      provide: "CONFIG",
      useValue: process.env.NODE_ENV === 'production' ? proConfig : devConfig,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('songs');
  }
  constructor(private dataSource: DataSource) {
    console.log('Connected to DB: ', dataSource.driver.database);
  }

}


