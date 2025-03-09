import express from 'express';
import router from './routes/routes.js';
import errorHandler from './middleware/errorHandler.js';
import { createContext } from './middleware/createContext.js';
import { port } from './utils/config.js';

const app = express();

app.use(express.json());

app.use('/api', router);

app.use(errorHandler);

app.use(createContext);

/**
 * Starts the Express server.
 */
app.listen(port, () => console.log(`Server running on port ${port}`));
