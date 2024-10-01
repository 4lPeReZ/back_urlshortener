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
    let { originalUrl } = req.body;

    // Validar si la URL es válida
    if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ message: 'URL inválida' });
    }

    // Asegurarse de que la URL tenga un protocolo
    if (!/^https?:\/\//i.test(originalUrl)) {
        originalUrl = 'http://' + originalUrl;
        console.log(`Agregado protocolo http:// a la URL: ${originalUrl}`);
    }

    try {
        // Verificar si la URL original ya existe
        let url = await Url.findOne({ originalUrl });
        if (url) {
            return res.status(200).json(url); // Devolver URL existente si ya fue acortada
        }

        // Crear un nuevo enlace corto
        const shortUrl = nanoid();
        url = new Url({ originalUrl, shortUrl });

        // Guardar en la base de datos
        await url.save();
        return res.status(201).json(url); // Devuelve el nuevo enlace acortado
    } catch (error) {
        console.error('Error al crear URL acortada:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Redirigir a la URL original
export const redirectToUrl = async (req, res) => {
    const { shortUrl } = req.params;

    try {
        const url = await Url.findOne({ shortUrl });
        if (url) {
            console.log('Redirigiendo a:', url.originalUrl); // Asegúrate de que la URL es correcta
            // Redirigir a la URL original
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json({ message: 'URL no encontrada' });
        }
    } catch (error) {
        console.error('Error al redirigir la URL:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todas las URLs
export const getAllUrls = async (req, res) => {
    console.log('Solicitud recibida en /urls');
    try {
        const urls = await Url.find(); // Obtener todas las URLs de la base de datos
        if (!urls.length) {
            return res.status(404).json({ message: 'No se encontraron URLs' });
        }
        return res.status(200).json(urls);
    } catch (error) {
        console.error('Error al obtener las URLs:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener una URL por su ID
export const getUrlById = async (req, res) => {
    const { id } = req.params;

    try {
        const url = await Url.findById(id); // Buscar la URL por su ID
        if (url) {
            return res.status(200).json(url); // Devolver la URL encontrada
        } else {
            return res.status(404).json({ message: 'URL no encontrada' });
        }
    } catch (error) {
        console.error('Error al buscar la URL por ID:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar una URL por su ID
export const updateUrlById = async (req, res) => {
    const { id } = req.params;
    const { originalUrl } = req.body;

    // Validar si la nueva URL es válida
    if (!originalUrl || !/^https?:\/\//i.test(originalUrl)) {
        return res.status(400).json({ message: 'URL inválida o faltante' });
    }

    try {
        // Buscar y actualizar la URL
        const url = await Url.findByIdAndUpdate(id, { originalUrl }, { new: true });
        if (!url) {
            return res.status(404).json({ message: 'URL no encontrada' });
        }

        return res.status(200).json(url); // Devolver la URL actualizada
    } catch (error) {
        console.error('Error al actualizar la URL:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar una URL por su ID
export const deleteUrlById = async (req, res) => {
    const { id } = req.params;

    try {
        const url = await Url.findByIdAndDelete(id); // Eliminar la URL por su ID
        if (!url) {
            return res.status(404).json({ message: 'URL no encontrada' });
        }

        return res.status(200).json({ message: 'URL eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la URL:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};