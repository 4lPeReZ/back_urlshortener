// config/passport-setup.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.mjs';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ googleId: profile.id }).then((currentUser) => {
    if (currentUser) {
      done(null, currentUser);
    } else {
      new User({
        googleId: profile.id,
        username: profile.displayName,
        thumbnail: profile._json.picture
      }).save().then((newUser) => {
        done(null, newUser);
      });
    }
  });
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/api/auth/github/callback`
}, (accessToken, refreshToken, profile, done) => {
  User.findOne({ githubId: profile.id }).then((currentUser) => {
    if (currentUser) {
      done(null, currentUser);
    } else {
      new User({
        githubId: profile.id,
        username: profile.username,
        thumbnail: profile._json.avatar_url
      }).save().then((newUser) => {
        done(null, newUser);
      });
    }
  });
}));
