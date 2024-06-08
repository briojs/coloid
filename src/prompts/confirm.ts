import { ConfirmPrompt } from '@clack/core';
import chalk from 'chalk';
import {
  S_BAR,
  S_BAR_END,
  S_RADIO_ACTIVE,
  S_RADIO_INACTIVE,
  symbol,
} from './utils.ts';

export interface ConfirmOptions {
  message: string;
  active?: string;
  inactive?: string;
  initialValue?: boolean;
}

export const confirmPrompt = (opts: ConfirmOptions) => {
  const active = opts.active ?? 'Yes';
  const inactive = opts.inactive ?? 'No';
  return new ConfirmPrompt({
    active,
    inactive,
    initialValue: opts.initialValue ?? true,
    render() {
      const title = `${chalk.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;
      const value = this.value ? active : inactive;

      switch (this.state) {
        case 'submit': {
          return `${title}${chalk.gray(S_BAR)}  ${chalk.dim(value)}`;
        }
        case 'cancel': {
          return `${title}${chalk.gray(S_BAR)}  ${chalk.strikethrough(
            chalk.dim(value),
          )}\n${chalk.gray(S_BAR)}`;
        }
        default: {
          return `${title}${chalk.cyan(S_BAR)}  ${
            this.value
              ? `${chalk.green(S_RADIO_ACTIVE)} ${active}`
              : `${chalk.dim(S_RADIO_INACTIVE)} ${chalk.dim(active)}`
          } ${chalk.dim('/')} ${
            this.value
              ? `${chalk.dim(S_RADIO_INACTIVE)} ${chalk.dim(inactive)}`
              : `${chalk.green(S_RADIO_ACTIVE)} ${inactive}`
          }\n${chalk.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<boolean | symbol>;
};
