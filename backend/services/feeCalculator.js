const calculateFee = (amount, userTier) => {
  const baseFees = {
    basic: 0.02,    // 2%
    premium: 0.015, // 1.5%
    vip: 0.01      // 1%
  };
  
  const dailyLimits = {
    basic: 1000,
    premium: 5000,
    vip: 10000
  };
  
  const monthlyLimits = {
    basic: 5000,
    premium: 20000,
    vip: 50000
  };
  
  return {
    fee: amount * (baseFees[userTier] || baseFees.basic),
    dailyLimit: dailyLimits[userTier] || dailyLimits.basic,
    monthlyLimit: monthlyLimits[userTier] || monthlyLimits.basic
  };
};

module.exports = { calculateFee }; 