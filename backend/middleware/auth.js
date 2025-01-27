const validateAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });
    
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = { validateAdmin }; 