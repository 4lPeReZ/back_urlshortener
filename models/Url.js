import mongoose from 'mongoose';
import validator from 'validator'; // Para validación de URL

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(url) {
        return validator.isURL(url); // Valida que sea una URL válida
      },
      message: 'URL inválida',
    },
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Relación con el usuario que creó la URL (opcional para anónimos)
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Índice en `shortUrl` para mejorar la búsqueda
urlSchema.index({ shortUrl: 1 });

const Url = mongoose.model('Url', urlSchema);

export default Url;
