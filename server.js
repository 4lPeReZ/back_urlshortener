import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js'; // Importa la configuración de Passport
import authRoutes from './routes/authRoutes.js'; // Asegúrate de que authRoutes está bien configurado

dotenv.config(); // Cargar las variables de entorno

const app = express();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Conectado a MongoDB');
}).catch(err => {
    console.error('Error conectando a MongoDB:', err);
});

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configurar sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,  // Utiliza el URL de MongoDB desde las variables de entorno
        collectionName: 'sessions',       // Puedes especificar el nombre de la colección de sesiones
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Duración de la sesión: 1 día
    }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Ruta inicial de prueba
app.get('/', (req, res) => {
    res.send('Bienvenido al acortador de URLs');
});

// Escuchar en el puerto configurado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
