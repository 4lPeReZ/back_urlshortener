import express from 'express';
import Url from '../models/Url.mjs';
import { nanoid } from 'nanoid';
import { body, validationResult } from 'express-validator';
import NodeCache from 'node-cache';

const urlCache = new NodeCache({ stdTTL: 600 });
const router = express.Router();

// Define tu base URL
const baseUrl = 'https://back-urlshortener.onrender.com';

// Ruta para acortar una URL
router.post('/shorten',
  body('originalUrl').isURL().withMessage('Invalid URL'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { originalUrl, userId, expiresAt, customUrl } = req.body;
    const shortUrl = customUrl || nanoid(7);

    try {
      const url = new Url({ originalUrl, shortUrl, userId, expiresAt });
      await url.save();
      const fullShortUrl = `${baseUrl}/api/url/${shortUrl}`;
      res.status(201).json({
        originalUrl: url.originalUrl,
        shortUrl: fullShortUrl,
        userId: url.userId,
        expiresAt: url.expiresAt,
        status: url.status,
        clicks: url.clicks,
        createdAt: url.createdAt,
        _id: url._id
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Ruta para obtener las URLs acortadas por un usuario
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const urls = await Url.find({ userId });

    // Actualizar la URL corta para que incluya el dominio completo
    const fullUrls = urls.map(url => ({
      ...url._doc,
      shortUrl: `${baseUrl}/api/url/${url.shortUrl}`
    }));

    res.status(200).json(fullUrls);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para redireccionar una URL acortada
router.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  console.log(`Attempting to redirect shortUrl: ${shortUrl}`);

  let url = urlCache.get(shortUrl);
  if (!url) {
    try {
      url = await Url.findOne({ shortUrl });
      if (url) {
        urlCache.set(shortUrl, url);
      } else {
        console.log(`URL not found for shortUrl: ${shortUrl}`);
        return res.status(404).json({ message: 'URL not found' });
      }
    } catch (error) {
      console.error(`Error finding URL for shortUrl: ${shortUrl}`, error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    console.log(`URL has expired for shortUrl: ${shortUrl}`);
    return res.status(410).json({ message: 'URL has expired' });
  }

  url.clicks += 1;
  await url.save();
  console.log(`Redirecting to originalUrl: ${url.originalUrl}`);
  return res.redirect(url.originalUrl);
});

// Ruta para editar una URL acortada
router.put('/update/:id', 
  body('originalUrl').optional().isURL().withMessage('Invalid URL'),
  body('expiresAt').optional().isISO8601().toDate().withMessage('Invalid date format'),
  body('status').optional().isIn(['Active', 'Inactive']).withMessage('Invalid status'),
  async (req, res) => {
  const { id } = req.params;
  const { originalUrl, expiresAt, status } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const url = await Url.findById(id);
    if (url) {
      // Si se proporciona una nueva originalUrl, generamos una nueva shortUrl
      if (originalUrl) {
        url.originalUrl = originalUrl;
        url.shortUrl = nanoid(7); // Genera una nueva shortUrl
      }
      url.expiresAt = expiresAt || url.expiresAt;
      url.status = status || url.status;
      await url.save();
      
      // Agregar la URL completa al campo shortUrl
      const fullShortUrl = `${baseUrl}/api/url/${url.shortUrl}`;

      res.status(200).json({
        _id: url._id,
        originalUrl: url.originalUrl,
        shortUrl: fullShortUrl,
        userId: url.userId,
        clicks: url.clicks,
        status: url.status,
        createdAt: url.createdAt,
        expiresAt: url.expiresAt
      });
    } else {
      res.status(404).json({ message: 'URL not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar una URL acortada
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Url.findByIdAndDelete(id);
    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
