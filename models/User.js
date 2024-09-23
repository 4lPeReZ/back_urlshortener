import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  provider: {
    type: String,
    required: true, // 'google' o 'github'
  },
  providerId: {
    type: String,
    required: true, // ID proporcionado por Google o GitHub
  },
  avatar: {
    type: String, // URL de la imagen del usuario
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

export default User;
