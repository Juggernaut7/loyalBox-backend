// middleware/verifyRoles.js
module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.role || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    next();
  };
};
