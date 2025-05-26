import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Artist } from "src/artists/artist.entity";
import { Playlist } from "src/playlists/playlist.entity";
import { Song } from "src/songs/song.entity";
import { User } from "src/users/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";
export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => {
        const dbType = configService.get<'postgres'>('type');
        console.log('🧪 TypeORM type:', dbType); // ✅ DEBUG
        return {
            type: dbType,
            host: configService.get<string>('dbHost'),
            port: configService.get<number>('dbPort'),
            username: configService.get<string>('username'),
            password: configService.get<string>('password'),
            database: configService.get<string>('dbName'),
            entities: [User, Playlist, Artist, Song],
            migrations: ['dist/db/migrations/*.js'],
            synchronize: false,
        };
    },
};


export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '3005'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: ["dist/**/*.entity.js"],
    synchronize: false,
    migrations: ["dist/db/migrations/*.js"]
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;