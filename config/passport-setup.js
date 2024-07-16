// config/passport-setup.js

import dotenv from 'dotenv';
dotenv.config(); // Asegúrate de cargar las variables de entorno

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.mjs';

// Debugging: Log the environment variables to ensure they are loaded
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET);
console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID);
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET);

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

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let currentUser = await User.findOne({ googleId: profile.id });
    if (currentUser) {
      done(null, currentUser);
    } else {
      const newUser = await new User({
        googleId: profile.id,
        username: profile.displayName,
        thumbnail: profile._json.picture
      }).save();
      done(null, newUser);
    }
  } catch (err) {
    done(err, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/github/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let currentUser = await User.findOne({ githubId: profile.id });
    if (currentUser) {
      done(null, currentUser);
    } else {
      const newUser = await new User({
        githubId: profile.id,
        username: profile.username,
        thumbnail: profile._json.avatar_url
      }).save();
      done(null, newUser);
    }
  } catch (err) {
    done(err, null);
  }
}));

export default passport;
