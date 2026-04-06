import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const splitToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    const verified = jwt.verify(splitToken, process.env.JWT_SECRET || 'secretkey');
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
