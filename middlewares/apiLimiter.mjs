import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 peticiones por IP por `windowMs`
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', apiLimiter);
