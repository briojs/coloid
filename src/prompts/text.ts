import { TextPrompt } from '@clack/core';
import chalk from 'chalk';
import { S_BAR, S_BAR_END, symbol } from './utils.ts';

export interface TextOptions {
  message: string;
  placeholder?: string;
  defaultValue?: string;
  initialValue?: string;
  validate?: (value: string) => string | void;
}

export const textPrompt = (opts: TextOptions) => {
  return new TextPrompt({
    validate: opts.validate,
    placeholder: opts.placeholder,
    defaultValue: opts.defaultValue,
    initialValue: opts.initialValue,
    render() {
      const title = `${chalk.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
      const placeholder = opts.placeholder
        ? chalk.inverse(opts.placeholder[0]) +
          chalk.dim(opts.placeholder.slice(1))
        : chalk.inverse(chalk.hidden('_'));

      const value = this.value ? this.valueWithCursor : placeholder;

      switch (this.state) {
        case 'error': {
          return `${title.trim()}\n${chalk.yellow(S_BAR)}  ${value}\n${chalk.yellow(
            S_BAR_END,
          )}  ${chalk.yellow(this.error)}\n`;
        }
        case 'submit': {
          return `${title}${chalk.gray(S_BAR)}  ${chalk.dim(this.value || opts.placeholder)}`;
        }
        case 'cancel': {
          return `${title}${chalk.gray(S_BAR)}  ${chalk.strikethrough(
            chalk.dim(this.value ?? ''),
          )}${this.value?.trim() ? '\n' + chalk.gray(S_BAR) : ''}`;
        }
        default: {
          return `${title}${chalk.cyan(S_BAR)}  ${value}\n${chalk.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<string | symbol>;
};
