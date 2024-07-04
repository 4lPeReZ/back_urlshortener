import express from 'express';
import Url from '../models/Url.mjs';
import { nanoid } from 'nanoid';

const router = express.Router();

// Ruta para acortar una URL
router.post('/shorten', async (req, res) => {
  const { originalUrl, userId } = req.body;
  const shortUrl = nanoid(7);

  try {
    const url = new Url({ originalUrl, shortUrl, userId });
    await url.save();
    res.status(201).json(url);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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

  try {
    const url = await Url.findOne({ shortUrl });
    if (url) {
      url.clicks += 1;
      await url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ message: 'URL not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
