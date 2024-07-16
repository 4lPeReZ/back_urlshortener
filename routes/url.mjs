// routes/url.mjs

import express from 'express';
import Url from '../models/Url.mjs';
import { nanoid } from 'nanoid';
import { body, validationResult } from 'express-validator';
import NodeCache from 'node-cache';

const urlCache = new NodeCache({ stdTTL: 600 });
const router = express.Router();

// Define tu base URL
const baseUrl = process.env.BASE_URL;

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

    try {
      const url = new Url({ originalUrl, shortUrl, expiresAt });
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

export default router;
