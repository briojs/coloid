import chalk from 'chalk';
import strip from 'strip-ansi';
import {
  S_BAR,
  S_BAR_END,
  S_BAR_H,
  S_BAR_START,
  S_CONNECT_LEFT,
  S_CORNER_BOTTOM_RIGHT,
  S_CORNER_TOP_RIGHT,
  S_STEP_SUBMIT,
} from './utils.ts';

export const note = (message = '', title = '') => {
  const lines = `\n${message}\n`.split('\n');
  const titleLen = strip(title).length;
  const len =
    Math.max(
      lines.reduce((sum, ln) => {
        ln = strip(ln);
        return ln.length > sum ? ln.length : sum;
      }, 0),
      titleLen,
    ) + 2;
  const msg = lines
    .map(
      (ln) =>
        `${chalk.gray(S_BAR)}  ${chalk.dim(ln)}${' '.repeat(len - strip(ln).length)}${chalk.gray(
          S_BAR,
        )}`,
    )
    .join('\n');
  process.stdout.write(
    `${chalk.gray(S_BAR)}\n${chalk.green(S_STEP_SUBMIT)}  ${chalk.reset(title)} ${chalk.gray(
      S_BAR_H.repeat(Math.max(len - titleLen - 1, 1)) + S_CORNER_TOP_RIGHT,
    )}\n${msg}\n${chalk.gray(S_CONNECT_LEFT + S_BAR_H.repeat(len + 2) + S_CORNER_BOTTOM_RIGHT)}\n`,
  );
};

export const cancel = (message = '') => {
  process.stdout.write(`${chalk.gray(S_BAR_END)}  ${chalk.red(message)}\n\n`);
};

export const intro = (title = '') => {
  process.stdout.write(`${chalk.gray(S_BAR_START)}  ${title}\n`);
};

export const outro = (message = '') => {
  process.stdout.write(
    `${chalk.gray(S_BAR)}\n${chalk.gray(S_BAR_END)}  ${message}\n\n`,
  );
};
