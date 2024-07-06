import csurf from 'csurf';
const csrfProtection = csurf({ cookie: true });

app.use(csrfProtection);

// Añadir un endpoint para obtener el token CSRF
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
