import express from 'express';
import router from './routes/routes.js';
import errorHandler from './middleware/errorHandler.js';
import { createContext } from './middleware/createContext.js';
import { port } from './utils/config.js';
import cors from 'cors';
import { testDbConnection } from './datastore/dbClient.js';

const app = express();

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
    await testDbConnection();

    // app.listen(port, () => {
    //     console.log(`Server running on port ${port}`);
    // });
};

startServer();

export default app;
