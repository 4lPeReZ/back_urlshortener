// models/User.mjs

import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  googleId: String,
  githubId: String,
  username: String,
  thumbnail: String
});

const User = mongoose.model('User', userSchema);

export default User;
