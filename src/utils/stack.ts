import { sep } from 'node:path';
import chalk from 'chalk';
import { LogType } from '../consts.ts';
import { colorText, typesColors } from './colors.ts';

export const formatErrorStack = (stack: string) => {
  const cwd = process.cwd() + sep;

  return stack
    .split('\n')
    .splice(1)
    .map((l) => l.trim().replace('file://', '').replace(cwd, ''));
};

export const stackWithColors = (stack: string, type: LogType) => {
  const formattedStack = formatErrorStack(stack).map(
    (line) =>
      '  ' +
      line
        .replace(/^at +/, (m) => chalk.gray(m))
        .replace(/\((.+)\)/, (_, m) => `(${colorText(m, typesColors[type])})`),
  );

  return '\n' + formattedStack.join('\n');
};
