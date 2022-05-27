const pattern = '^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$';

export const isEmailAddress = (str: string) => {
  return str.match(pattern);
};
