const jwt = require('jsonwebtoken');
// Mavjud User modelingizni ishlatadi - bu yerda qayta e'lon qilinmaydi.
const User = require('../models/User');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Avtorizatsiya talab qilinadi' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id');
    if (!user) return res.status(401).json({ message: 'Foydalanuvchi topilmadi' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token yaroqsiz' });
  }
};

module.exports = { protect };
