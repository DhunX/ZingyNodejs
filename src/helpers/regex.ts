const pattern = '^w+@[a-zA-Z_]+?.[a-zA-Z]{2,3}$';

export const isEmailAddress = (str: string) => {
  return str.match(pattern);
};
