import express from 'express';
import { createUrl, redirectToUrl } from '../controllers/urlController.js';

const router = express.Router();

// Ruta para crear una URL acortada
router.post('/url', createUrl);

// Ruta para redirigir a la URL original a partir de la URL acortada
router.get('/:shortUrl', redirectToUrl);

export default router;
