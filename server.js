import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import urlRoutes from './routes/urlRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './config/passport.js'; // Cargar Passport

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para manejar JSON
app.use(express.json());

// Configurar express-session (necesario para Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: true
}));

// Iniciar Passport
app.use(passport.initialize());
app.use(passport.session());

// Registrar las rutas
app.use('/', urlRoutes); // Asegúrate de que esto esté correctamente registrado
app.use('/', authRoutes);

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error conectando a MongoDB:', error);
  });

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
