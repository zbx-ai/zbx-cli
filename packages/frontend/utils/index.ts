export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const isEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
