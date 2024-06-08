import chalk, { ForegroundColorName } from 'chalk';
import { LogType } from '../consts.ts';

export const colorText = (
  text: any,
  color: string | undefined | ForegroundColorName,
) => {
  // @ts-expect-error Chalk
  return chalk[color](text);
};

export const colorBackground = (text: any, color: string) => {
  const bgColor = color.startsWith('bg')
    ? color
    : `bg${color[0].toUpperCase()}${color.slice(1)}`;

  // @ts-expect-error Chalk
  return chalk[bgColor](text);
};

export const typesColors: { [k in LogType]?: string } = {
  info: 'cyan',
  fail: 'red',
  success: 'green',
  ready: 'green',
  error: 'red',
  fatal: 'red',
  warn: 'yellow',
  debug: 'magenta',
  trace: 'cyan',
  log: 'magentaBright',
  box: 'yellowBright',
};
