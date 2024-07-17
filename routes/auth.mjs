// routes/auth.mjs

import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

function generateToken(user) {
  return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Ruta para autenticar con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Ruta de callback de Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.json({ token });
  }
);

// Ruta para autenticar con GitHub
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}));

// Ruta de callback de GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    const token = generateToken(req.user);
    res.json({ token });
  }
);

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

export default router;
