import {Router, Request, Response} from "express";
import prometheus from "prom-client";

const MetricsController  = Router();
const register = new prometheus.Registry();
prometheus.collectDefaultMetrics({ register });

MetricsController.get("/", async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.end(metrics);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la génération des métriques Prometheus');
    }
})

export default MetricsController;