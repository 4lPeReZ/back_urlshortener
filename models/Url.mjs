// models/Url.mjs

import mongoose from 'mongoose';

const { Schema } = mongoose;

const urlSchema = new Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  clicks: { type: Number, default: 0 },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

const Url = mongoose.model('Url', urlSchema);

export default Url;
