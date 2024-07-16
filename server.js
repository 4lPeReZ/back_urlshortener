// server.js

import dotenv from 'dotenv';
dotenv.config(); // Asegúrate de cargar las variables de entorno

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import passport from 'passport';
import urlRoutes from './routes/url.mjs';
import authRoutes from './routes/auth.mjs';
import './config/passport-setup.js'; // Importar setup de passport

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/auth', authRoutes);
app.use('/', urlRoutes);  // Asegúrate de que las rutas de URL sean manejadas desde la raíz

// Ruta raíz (opcional)
app.get('/', (req, res) => {
  res.send('URL Shortener API');
});

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
