import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import promiseRouter from 'express-promise-router';
import cors from 'cors';
import path from 'path';
import config from './utils/config';


// Logging format for morgan
const logFormat = process.env.NODE_ENV === 'development' ? 'dev' : 'combined';

// Set up express with promise routes
const router = promiseRouter();
export const app = express();

// CORS for development
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ credentials: true, origin: config.frontendUrl }));
}

// Other middleware
app
  .use(bodyParser.json())
  .use(morgan(logFormat))
  .use(router);

// Register controllers providing API endpoints
//apiController(router);

// Register frontend
app.use(express.static('public'));
app.get('*', (req, res) => res.sendFile(path.resolve('public', 'index.html')));

// Don't block ports in testing.
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, () => console.log(`Server running at port ${config.port}`));
}
