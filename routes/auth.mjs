// routes/auth.mjs

import express from 'express';
import passport from 'passport';

const router = express.Router();

// Ruta de autenticación con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Callback de Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/'); // Redirige al frontend después de la autenticación
});

// Ruta de autenticación con GitHub
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}));

// Callback de GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/'); // Redirige al frontend después de la autenticación
});

// Ruta para logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;
