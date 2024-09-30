import dotenv from 'dotenv';
dotenv.config(); // Cargar dotenv aquí para asegurar que las variables de entorno estén disponibles

import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

// Estrategia de GitHub
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,  // Accediendo a las variables de entorno
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      let user = await User.findOne({ provider: 'github', providerId: profile.id });
      if (!user) {
        user = await User.create({
          name: profile.displayName || 'Anonymous',
          email: profile.emails && profile.emails[0].value,
          provider: 'github',
          providerId: profile.id
        });
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

// Estrategia de Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,  // Accediendo a las variables de entorno
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      let user = await User.findOne({ provider: 'google', providerId: profile.id });
      if (!user) {
        user = await User.create({
          name: profile.displayName || 'Anonymous',
          email: profile.emails && profile.emails[0].value,
          provider: 'google',
          providerId: profile.id
        });
      }
      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  }
));

// Serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
