import express from 'express';
import router from './routes/routes.js';
import errorHandler from './middleware/errorHandler.js';
import { createContext } from './middleware/createContext.js';

const app = express();

app.use(express.json());

app.use('/api', router);

app.use(errorHandler);

app.use(createContext);

const PORT = 6000;
/**
 * Starts the Express server.
 */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
