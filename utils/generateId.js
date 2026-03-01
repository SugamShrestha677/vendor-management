let counters = {};

export const generateUniqueNumber = async (prefix) => {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const key = `${prefix}-${today}`;

  if (!counters[key]) {
    counters[key] = 0;
  }

  counters[key]++;
  const sequence = String(counters[key]).padStart(4, '0');

  return `${prefix}-${today}-${sequence}`;
};

export const generateOrderNumber = async () => {
  return generateUniqueNumber('ORD');
};

export const generateRequestNumber = async () => {
  return generateUniqueNumber('REQ');
};
