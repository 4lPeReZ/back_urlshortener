import mongoose from 'mongoose';
import validator from 'validator'; // Para validar el email

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false, // Opcional, algunos usuarios pueden no tener un nombre
  },
  email: {
    type: String,
    required: false, // Puedes hacer esto opcional si no siempre obtienes el email
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email inválido',
    },
  },
  provider: {
    type: String,
    required: true,  // 'google' o 'github'
  },
  providerId: {
    type: String,
    required: true,  // ID proporcionado por Google o GitHub
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Índice compuesto para evitar duplicados de provider y providerId
userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;
