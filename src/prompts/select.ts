import { SelectKeyPrompt, SelectPrompt } from '@clack/core';
import chalk from 'chalk';
import {
  Option,
  S_BAR,
  S_BAR_END,
  S_RADIO_ACTIVE,
  S_RADIO_INACTIVE,
  limitOptions,
  symbol,
} from './utils.ts';

export interface SelectOptions<Value> {
  message: string;
  options: Option<Value>[];
  initialValue?: Value;
  maxItems?: number;
}

export const selectPrompt = <Value>(opts: SelectOptions<Value>) => {
  const opt = (
    option: Option<Value>,
    state: 'inactive' | 'active' | 'selected' | 'cancelled',
  ) => {
    const label = option.label ?? String(option.value);
    switch (state) {
      case 'selected': {
        return `${chalk.dim(label)}`;
      }
      case 'active': {
        return `${chalk.green(S_RADIO_ACTIVE)} ${label} ${
          option.hint ? chalk.dim(`(${option.hint})`) : ''
        }`;
      }
      case 'cancelled': {
        return `${chalk.strikethrough(chalk.dim(label))}`;
      }
      default: {
        return `${chalk.dim(S_RADIO_INACTIVE)} ${chalk.dim(label)}`;
      }
    }
  };

  return new SelectPrompt({
    options: opts.options,
    initialValue: opts.initialValue,
    render() {
      const title = `${chalk.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;

      switch (this.state) {
        case 'submit': {
          return `${title}${chalk.gray(S_BAR)}  ${opt(this.options[this.cursor], 'selected')}`;
        }
        case 'cancel': {
          return `${title}${chalk.gray(S_BAR)}  ${opt(
            this.options[this.cursor],
            'cancelled',
          )}\n${chalk.gray(S_BAR)}`;
        }
        default: {
          return `${title}${chalk.cyan(S_BAR)}  ${limitOptions({
            cursor: this.cursor,
            options: this.options,
            maxItems: opts.maxItems,
            style: (item, active) => opt(item, active ? 'active' : 'inactive'),
          }).join(`\n${chalk.cyan(S_BAR)}  `)}\n${chalk.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<Value | symbol>;
};

export const selectKeyPrompt = <Value extends string>(
  opts: SelectOptions<Value>,
) => {
  const opt = (
    option: Option<Value>,
    state: 'inactive' | 'active' | 'selected' | 'cancelled' = 'inactive',
  ) => {
    const label = option.label ?? String(option.value);
    switch (state) {
      case 'selected': {
        return `${chalk.dim(label)}`;
      }
      case 'cancelled': {
        return `${chalk.strikethrough(chalk.dim(label))}`;
      }
      case 'active': {
        return `${chalk.bgCyan(chalk.gray(` ${option.value} `))} ${label} ${
          option.hint ? chalk.dim(`(${option.hint})`) : ''
        }`;
      }
    }
    return `${chalk.gray(chalk.bgWhite(chalk.inverse(` ${option.value} `)))} ${label} ${
      option.hint ? chalk.dim(`(${option.hint})`) : ''
    }`;
  };

  return new SelectKeyPrompt({
    options: opts.options,
    initialValue: opts.initialValue,
    render() {
      const title = `${chalk.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;

      switch (this.state) {
        case 'submit': {
          return `${title}${chalk.gray(S_BAR)}  ${opt(
            this.options.find((opt) => opt.value === this.value)!,
            'selected',
          )}`;
        }
        case 'cancel': {
          return `${title}${chalk.gray(S_BAR)}  ${opt(this.options[0], 'cancelled')}\n${chalk.gray(
            S_BAR,
          )}`;
        }
        default: {
          return `${title}${chalk.cyan(S_BAR)}  ${this.options
            .map((option, i) =>
              opt(option, i === this.cursor ? 'active' : 'inactive'),
            )
            .join(`\n${chalk.cyan(S_BAR)}  `)}\n${chalk.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<Value | symbol>;
};
