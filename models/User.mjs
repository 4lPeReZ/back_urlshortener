// models/User.mjs

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: String,
  githubId: String,
  username: String,
  email: { type: String, unique: true, sparse: true }, // sparse para permitir múltiples nulos
  thumbnail: String
});

const User = mongoose.model('User', userSchema);

export default User;
