import express, { type Express } from 'express'
import swaggerUi from 'swagger-ui-express'
import { swaggerDocument } from './utils/swagger/swagger'
import { corsApp } from './utils/cors/corsApp'
import SessionController from "./controllers/session";
import cors from 'cors';
import prometheus from 'prom-client';

const port: number = 3001
const app = express()
const httpServer: Express = require('http').createServer(app)
const io = require('socket.io')(httpServer, corsApp)

// Créez un registre Prometheus
const register = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register });
app.get('/metrics', async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.end(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la génération des métriques Prometheus');
    }
});


app.use(cors(corsApp))
app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerDocument)
app.use('/session', SessionController)
require("./controllers/socket")(io)


httpServer.listen(port, () => { console.log(`listening on port ${port} ${process.argv[2]}`) })

module.exports.ioobject = io;
