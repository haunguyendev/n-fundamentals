import { Injectable } from "@nestjs/common";


@Injectable()
export class DevConfigService {
    private readonly _DBHOST = 'localhost';
    get DBHOST() {
        return this._DBHOST;
    }
}