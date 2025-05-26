export default () => ({
    type: 'postgres', // 👈 PHẢI CÓ
    port: parseInt(process.env.PORT ?? '3000', 10),
    secret: process.env.SECRET,
    dbHost: process.env.DB_HOST,
    dbPort: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dbName: process.env.DB_NAME
});
