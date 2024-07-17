import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.mjs';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
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
    if (!currentUser) {
      currentUser = await new User({
        googleId: profile.id,
        username: profile.displayName,
        thumbnail: profile._json.picture,
        email: profile.emails[0].value  // Obtener el correo electrónico del perfil
      }).save();
    }
    done(null, currentUser);
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
    const email = profile.emails && profile.emails[0] && profile.emails[0].value || null;
    let currentUser = await User.findOne({ githubId: profile.id });
    if (!currentUser) {
      currentUser = await new User({
        githubId: profile.id,
        username: profile.username,
        thumbnail: profile._json.avatar_url,
        email: email  // Obtener el correo electrónico del perfil si está disponible
      }).save();
    }
    done(null, currentUser);
  } catch (err) {
    done(err, null);
  }
}));

export default passport;
