// server.js

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import passport from 'passport';
import urlRoutes from './routes/url.mjs';
import authRoutes from './routes/auth.mjs';
import './config/passport-setup.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Asegúrate de que 'secure' esté configurado adecuadamente
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/', urlRoutes);

app.get('/', (req, res) => {
  res.send('URL Shortener API');
});

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
