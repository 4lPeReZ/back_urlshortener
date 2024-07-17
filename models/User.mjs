import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true },
  thumbnail: { type: String },
});

const User = mongoose.model('User', userSchema);
export default User;
