import express from 'express';
import router from './routes/routes.js';
import errorHandler from './middleware/errorHandler.js';
import { createContext } from './middleware/createContext.js';
import { port } from './utils/config.js';
import cors from 'cors';
import http from 'http';

import { connectToPostgres } from './datastore/dbClient.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use(cors());

app.use('/api', router);

app.use(errorHandler);

app.use(createContext);

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const startServer = async () => {
    await connectToPostgres();

    server.listen(port, () => {
        console.log(`🚀 Server started at http://localhost:${port}`);
    });
};

startServer();

export default app;
