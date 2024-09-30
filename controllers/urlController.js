import Url from '../models/Url.js';
import { customAlphabet } from 'nanoid';

// Generador de enlaces cortos
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);

// Validación básica de una URL válida usando expresión regular
const isValidUrl = (url) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocolo
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // dominio
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // o dirección IP (v4)
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // puerto y ruta
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // cadena de consulta
    '(\\#[-a-z\\d_]*)?$','i'); // fragmento
    return !!urlPattern.test(url);
};

// Crear una URL acortada
export const createUrl = async (req, res) => {
    const { originalUrl } = req.body;

    // Validar si la URL es válida
    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ message: 'URL inválida' });
    }

    try {
        // Validar si la URL original ya existe
        let url = await Url.findOne({ originalUrl });
        if (url) {
            return res.status(200).json(url);
        }

        // Crear un enlace corto
        const shortUrl = nanoid();
        url = new Url({ originalUrl, shortUrl });

        // Guardar en la base de datos
        await url.save();
        return res.status(201).json(url);
    } catch (error) {
        console.error('Error al acortar la URL:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Redirigir a la URL original
export const redirectToUrl = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });
        if (url) {
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ message: 'URL no encontrada' });
        }
    } catch (error) {
        console.error('Error al redirigir la URL:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};
