export const connection: Connection = {
    CONNECTION_STRING: 'mongodb://localhost:27017',
    DB: 'MYSQL',
    DBNAME: 'TEST'
}


export type Connection = {
    CONNECTION_STRING: string;
    DB: string;
    DBNAME: string;
}