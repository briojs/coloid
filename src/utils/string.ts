import _stringWidth from 'string-width';

export const stringWidth = (str: string) => {
  return typeof Bun === 'undefined' ? _stringWidth(str) : Bun.stringWidth(str);
};
