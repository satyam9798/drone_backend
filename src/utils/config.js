import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 6000;
const allowedOrigins = [''];

export { port, allowedOrigins };
