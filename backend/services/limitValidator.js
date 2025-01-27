const validateWithdrawalLimits = async (userId, amount, prisma) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const [dailyTotal, monthlyTotal, userTier] = await prisma.$transaction([
    prisma.withdrawal.aggregate({
      where: {
        userId,
        status: 'approved',
        createdAt: {
          gte: new Date(today.setHours(0, 0, 0, 0))
        }
      },
      _sum: { amount: true }
    }),
    prisma.withdrawal.aggregate({
      where: {
        userId,
        status: 'approved',
        createdAt: {
          gte: firstDayOfMonth
        }
      },
      _sum: { amount: true }
    }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true }
    })
  ]);

  const { dailyLimit, monthlyLimit } = calculateFee(amount, userTier.tier);
  
  if ((dailyTotal._sum.amount || 0) + amount > dailyLimit) {
    throw new Error(`Daily withdrawal limit of $${dailyLimit} exceeded`);
  }
  
  if ((monthlyTotal._sum.amount || 0) + amount > monthlyLimit) {
    throw new Error(`Monthly withdrawal limit of $${monthlyLimit} exceeded`);
  }
  
  return true;
};

module.exports = { validateWithdrawalLimits };