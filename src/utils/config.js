import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8080;
const allowedOrigins = [''];

export { port, allowedOrigins };
