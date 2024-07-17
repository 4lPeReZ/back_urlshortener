import express from 'express';
import Url from '../models/Url.mjs';
import { nanoid } from 'nanoid';
import { body, validationResult } from 'express-validator';
import NodeCache from 'node-cache';
import jwt from 'jsonwebtoken';

const urlCache = new NodeCache({ stdTTL: 600 });
const router = express.Router();

const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

// Middleware para verificar el token JWT y obtener el userId
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Ruta para acortar una URL
router.post('/shorten', authenticateToken,
  body('originalUrl').isURL().withMessage('Invalid URL'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Authenticated User:', req.user);
    const { originalUrl, customUrl, expiresAt } = req.body;
    const shortUrl = customUrl || nanoid(7);
    const userId = req.user ? req.user.id : null;

    try {
      const url = new Url({ originalUrl, shortUrl, expiresAt, userId });
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

// Ruta para obtener las URLs acortadas por un usuario autenticado
router.get('/user/urls', authenticateToken, async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user.id });

    // Añadir el dominio completo a las URLs cortas
    const fullUrls = urls.map(url => ({
      ...url._doc,
      shortUrl: `${baseUrl}/${url.shortUrl}`
    }));

    res.status(200).json(fullUrls);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
