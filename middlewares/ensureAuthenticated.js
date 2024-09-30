const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next(); // Usuario autenticado, sigue al siguiente middleware o controlador
    }
  
    // Usuario no autenticado, responde con un 401 (Unauthorized)
    res.status(401).json({ message: 'No estás autenticado. Por favor, inicia sesión.' });
};
  
export default ensureAuthenticated;
  