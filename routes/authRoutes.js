import express from 'express';
import passport from 'passport';

const router = express.Router();

// Ruta de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback de Google
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Aquí redirige al frontend o responde con el estado de autenticación
    res.redirect('/profile'); // O redirige a una página del frontend que maneje el estado del usuario
  }
);

// Ruta de autenticación con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback de GitHub
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Redirige al frontend o envía el estado del usuario
    res.redirect('/profile'); // O modifica esto según tu frontend
  }
);

// Cerrar sesión
router.get('/logout', async (req, res, next) => {
  try {
    // Usar logout con async/await en versiones modernas de Passport
    await req.logout();
    res.redirect('/');
  } catch (err) {
    next(err); // Maneja el error de logout si ocurre
  }
});

export default router;
