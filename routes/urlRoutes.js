import express from 'express';
import { createUrl, redirectToUrl, getAllUrls, getUrlById, updateUrlById, deleteUrlById } from '../controllers/urlController.js';

const router = express.Router();

// Ruta para obtener todas las URLs
router.get('/urls', getAllUrls);

// Ruta para crear una URL acortada
router.post('/url', createUrl);

// Ruta para obtener una URL por su ID
router.get('/url/:id', getUrlById);

// Ruta para actualizar una URL por su ID
router.put('/url/:id', updateUrlById);

// Nueva ruta para eliminar una URL por su ID
router.delete('/url/:id', deleteUrlById);  // <--- Nueva ruta para eliminar una URL

// Ruta para redirigir a la URL original usando el shortUrl
router.get('/:shortUrl', redirectToUrl);

export default router;
