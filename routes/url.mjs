import express from 'express';
import Url from '../models/Url.mjs';
import { nanoid } from 'nanoid';
import { body, validationResult } from 'express-validator';
import NodeCache from 'node-cache';

const urlCache = new NodeCache({ stdTTL: 600 });
const router = express.Router();

// Define tu base URL
const baseUrl = 'http://localhost:5000/api/url/s'; // Cambia esto a tu dominio

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
      const fullShortUrl = `${baseUrl}/${shortUrl}`;
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
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const urls = await Url.find({ userId });
    res.status(200).json(urls);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para redireccionar una URL acortada
router.get('/s/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;

  let url = urlCache.get(shortUrl);
  if (!url) {
    try {
      url = await Url.findOne({ shortUrl });
      if (url) {
        urlCache.set(shortUrl, url);
      } else {
        return res.status(404).json({ message: 'URL not found' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (url.expiresAt && url.expiresAt < new Date()) {
    return res.status(410).json({ message: 'URL has expired' });
  }

  url.clicks += 1;
  await url.save();
  return res.redirect(url.originalUrl);
});

// Ruta para editar una URL acortada
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { originalUrl, expiresAt, status } = req.body;

  try {
    const url = await Url.findById(id);
    if (url) {
      url.originalUrl = originalUrl || url.originalUrl;
      url.expiresAt = expiresAt || url.expiresAt;
      url.status = status || url.status;
      await url.save();
      res.status(200).json(url);
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
