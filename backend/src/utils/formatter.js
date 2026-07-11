const formatCurrency = (amount, currency = 'BDT') => {
  const formatted = Number(amount).toLocaleString('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return formatted;
};

const formatPercentage = (value) => {
  return `${Number(value).toFixed(2)}%`;
};

const formatLargeNumber = (num) => {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toString();
};

const maskEmail = (email) => {
  const [local, domain] = email.split('@');
  const maskedLocal = local.charAt(0) + '***' + local.charAt(local.length - 1);
  return `${maskedLocal}@${domain}`;
};

const maskPhone = (phone) => {
  if (phone.length <= 4) return phone;
  const visible = phone.slice(-4);
  return `***${visible}`;
};

module.exports = {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  maskEmail,
  maskPhone,
};
