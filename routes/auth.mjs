// routes/auth.mjs

import express from 'express';
import passport from 'passport';

const router = express.Router();

// Ruta para autenticar con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback de Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/'); // Redirige a la página principal o a donde desees después de autenticarte
});

// Ruta para autenticar con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Ruta de callback de GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/'); // Redirige a la página principal o a donde desees después de autenticarte
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

export default router;
