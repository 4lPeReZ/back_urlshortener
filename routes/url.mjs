// routes/url.mjs

import express from 'express';
import Url from '../models/Url.mjs';
import { nanoid } from 'nanoid';
import { body, validationResult } from 'express-validator';
import NodeCache from 'node-cache';

const urlCache = new NodeCache({ stdTTL: 600 });
const router = express.Router();

// Define tu base URL
const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

// Ruta para acortar una URL
router.post('/shorten',
  body('originalUrl').isURL().withMessage('Invalid URL'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { originalUrl, customUrl, expiresAt } = req.body;
    const shortUrl = customUrl || nanoid(7);
    const userId = req.user ? req.user._id : null; // Obtener userId de la sesión si está autenticado

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

export default router;
