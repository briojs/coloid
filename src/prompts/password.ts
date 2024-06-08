import { PasswordPrompt } from '@clack/core';
import chalk from 'chalk';
import { S_BAR, S_BAR_END, S_PASSWORD_MASK, symbol } from './utils.ts';

export interface PasswordOptions {
  message: string;
  mask?: string;
  validate?: (value: string) => string | void;
}

export const passwordPrompt = (opts: PasswordOptions) => {
  return new PasswordPrompt({
    validate: opts.validate,
    mask: opts.mask ?? S_PASSWORD_MASK,
    render() {
      const title = `${chalk.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
      const value = this.valueWithCursor;
      const masked = this.masked;

      switch (this.state) {
        case 'error': {
          return `${title.trim()}\n${chalk.yellow(S_BAR)}  ${masked}\n${chalk.yellow(
            S_BAR_END,
          )}  ${chalk.yellow(this.error)}\n`;
        }
        case 'submit': {
          return `${title}${chalk.gray(S_BAR)}  ${chalk.dim(masked)}`;
        }
        case 'cancel': {
          return `${title}${chalk.gray(S_BAR)}  ${chalk.strikethrough(chalk.dim(masked ?? ''))}${
            masked ? '\n' + chalk.gray(S_BAR) : ''
          }`;
        }
        default: {
          return `${title}${chalk.cyan(S_BAR)}  ${value}\n${chalk.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<string | symbol>;
};
