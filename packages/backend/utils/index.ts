export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const hashPassword = (password: string): string => {
  return `hashed_${password}`; // Dummy implementation
};
