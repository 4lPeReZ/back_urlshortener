import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js'; // Importa el modelo de usuario

dotenv.config();

// Serialización de usuarios para sesiones
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

// Estrategia de Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Verifica si el usuario ya existe en la base de datos
    let user = await User.findOne({ providerId: profile.id, provider: 'google' });

    // Si no existe, crea un nuevo usuario
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        provider: 'google',
        providerId: profile.id,
        avatar: profile.photos[0].value,
      });
      await user.save();
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

// Estrategia de GitHub
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Verifica si el usuario ya existe en la base de datos
    let user = await User.findOne({ providerId: profile.id, provider: 'github' });

    // Si no existe, crea un nuevo usuario
    if (!user) {
      user = new User({
        name: profile.displayName || profile.username,
        email: profile.emails[0].value,
        provider: 'github',
        providerId: profile.id,
        avatar: profile.photos[0]?.value || '',
      });
      await user.save();
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

export default passport;
