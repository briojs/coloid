import { GroupMultiSelectPrompt, MultiSelectPrompt } from '@clack/core';
import chalk from 'chalk';
import {
  Option,
  S_BAR,
  S_BAR_END,
  S_CHECKBOX_ACTIVE,
  S_CHECKBOX_INACTIVE,
  S_CHECKBOX_SELECTED,
  limitOptions,
  symbol,
} from './utils.ts';

export interface MultiSelectOptions<Value> {
  message: string;
  options: Option<Value>[];
  initialValues?: Value[];
  maxItems?: number;
  required?: boolean;
  cursorAt?: Value;
}

export const multiselectPrompt = <Value>(opts: MultiSelectOptions<Value>) => {
  const opt = (
    option: Option<Value>,
    state:
      | 'inactive'
      | 'active'
      | 'selected'
      | 'active-selected'
      | 'submitted'
      | 'cancelled',
  ) => {
    const label = option.label ?? String(option.value);
    switch (state) {
      case 'active': {
        return `${chalk.cyan(S_CHECKBOX_ACTIVE)} ${label} ${
          option.hint ? chalk.dim(`(${option.hint})`) : ''
        }`;
      }
      case 'selected': {
        return `${chalk.green(S_CHECKBOX_SELECTED)} ${chalk.dim(label)}`;
      }
      case 'cancelled': {
        return `${chalk.strikethrough(chalk.dim(label))}`;
      }
      case 'active-selected': {
        return `${chalk.green(S_CHECKBOX_SELECTED)} ${label} ${
          option.hint ? chalk.dim(`(${option.hint})`) : ''
        }`;
      }
      case 'submitted': {
        return `${chalk.dim(label)}`;
      }
      // No default
    }
    return `${chalk.dim(S_CHECKBOX_INACTIVE)} ${chalk.dim(label)}`;
  };

  return new MultiSelectPrompt({
    options: opts.options,
    initialValues: opts.initialValues,
    required: opts.required ?? true,
    cursorAt: opts.cursorAt,
    validate(selected: Value[]) {
      if (this.required && selected.length === 0)
        return `Please select at least one option.\n${chalk.reset(
          chalk.dim(
            `Press ${chalk.gray(chalk.bgWhite(chalk.inverse(' space ')))} to select, ${chalk.gray(
              chalk.bgWhite(chalk.inverse(' enter ')),
            )} to submit`,
          ),
        )}`;
    },
    render() {
      let title = `${chalk.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;

      // eslint-disable-next-line unicorn/consistent-function-scoping
      const styleOption = (option: Option<Value>, active: boolean) => {
        const selected = this.value.includes(option.value);
        if (active && selected) {
          return opt(option, 'active-selected');
        }
        if (selected) {
          return opt(option, 'selected');
        }
        return opt(option, active ? 'active' : 'inactive');
      };

      switch (this.state) {
        case 'submit': {
          return `${title}${chalk.gray(S_BAR)}  ${
            this.options
              .filter(({ value }) => this.value.includes(value))
              .map((option) => opt(option, 'submitted'))
              .join(chalk.dim(', ')) || chalk.dim('none')
          }`;
        }
        case 'cancel': {
          const label = this.options
            .filter(({ value }) => this.value.includes(value))
            .map((option) => opt(option, 'cancelled'))
            .join(chalk.dim(', '));
          return `${title}${chalk.gray(S_BAR)}  ${
            label.trim() ? `${label}\n${chalk.gray(S_BAR)}` : ''
          }`;
        }
        case 'error': {
          const footer = this.error
            .split('\n')
            .map((ln, i) =>
              i === 0
                ? `${chalk.yellow(S_BAR_END)}  ${chalk.yellow(ln)}`
                : `   ${ln}`,
            )
            .join('\n');
          return (
            title +
            chalk.yellow(S_BAR) +
            '  ' +
            limitOptions({
              options: this.options,
              cursor: this.cursor,
              maxItems: opts.maxItems,
              style: styleOption,
            }).join(`\n${chalk.yellow(S_BAR)}  `) +
            '\n' +
            footer +
            '\n'
          );
        }
        default: {
          return `${title}${chalk.cyan(S_BAR)}  ${limitOptions({
            options: this.options,
            cursor: this.cursor,
            maxItems: opts.maxItems,
            style: styleOption,
          }).join(`\n${chalk.cyan(S_BAR)}  `)}\n${chalk.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<Value[] | symbol>;
};

export interface GroupMultiSelectOptions<Value> {
  message: string;
  options: Record<string, Option<Value>[]>;
  initialValues?: Value[];
  required?: boolean;
  cursorAt?: Value;
}
export const groupMultiselect = <Value>(
  opts: GroupMultiSelectOptions<Value>,
) => {
  const opt = (
    option: Option<Value>,
    state:
      | 'inactive'
      | 'active'
      | 'selected'
      | 'active-selected'
      | 'group-active'
      | 'group-active-selected'
      | 'submitted'
      | 'cancelled',
    options: Option<Value>[] = [],
  ) => {
    const label = option.label ?? String(option.value);
    const isItem = typeof (option as any).group === 'string';
    const next =
      isItem && (options[options.indexOf(option) + 1] ?? { group: true });
    const isLast = isItem && (next as any).group === true;
    const prefix = isItem ? `${isLast ? S_BAR_END : S_BAR} ` : '';

    switch (state) {
      case 'active': {
        return `${chalk.dim(prefix)}${chalk.cyan(S_CHECKBOX_ACTIVE)} ${label} ${
          option.hint ? chalk.dim(`(${option.hint})`) : ''
        }`;
      }
      case 'group-active': {
        return `${prefix}${chalk.cyan(S_CHECKBOX_ACTIVE)} ${chalk.dim(label)}`;
      }
      case 'group-active-selected': {
        return `${prefix}${chalk.green(S_CHECKBOX_SELECTED)} ${chalk.dim(label)}`;
      }
      case 'selected': {
        return `${chalk.dim(prefix)}${chalk.green(S_CHECKBOX_SELECTED)} ${chalk.dim(label)}`;
      }
      case 'cancelled': {
        return `${chalk.strikethrough(chalk.dim(label))}`;
      }
      case 'active-selected': {
        return `${chalk.dim(prefix)}${chalk.green(S_CHECKBOX_SELECTED)} ${label} ${
          option.hint ? chalk.dim(`(${option.hint})`) : ''
        }`;
      }
      case 'submitted': {
        return `${chalk.dim(label)}`;
      }
      // No default
    }
    return `${chalk.dim(prefix)}${chalk.dim(S_CHECKBOX_INACTIVE)} ${chalk.dim(label)}`;
  };

  return new GroupMultiSelectPrompt({
    options: opts.options,
    initialValues: opts.initialValues,
    required: opts.required ?? true,
    cursorAt: opts.cursorAt,
    validate(selected: Value[]) {
      if (this.required && selected.length === 0)
        return `Please select at least one option.\n${chalk.reset(
          chalk.dim(
            `Press ${chalk.gray(chalk.bgWhite(chalk.inverse(' space ')))} to select, ${chalk.gray(
              chalk.bgWhite(chalk.inverse(' enter ')),
            )} to submit`,
          ),
        )}`;
    },
    render() {
      let title = `${chalk.gray(S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`;

      switch (this.state) {
        case 'submit': {
          return `${title}${chalk.gray(S_BAR)}  ${this.options
            .filter(({ value }) => this.value.includes(value))
            .map((option) => opt(option, 'submitted'))
            .join(chalk.dim(', '))}`;
        }
        case 'cancel': {
          const label = this.options
            .filter(({ value }) => this.value.includes(value))
            .map((option) => opt(option, 'cancelled'))
            .join(chalk.dim(', '));
          return `${title}${chalk.gray(S_BAR)}  ${
            label.trim() ? `${label}\n${chalk.gray(S_BAR)}` : ''
          }`;
        }
        case 'error': {
          const footer = this.error
            .split('\n')
            .map((ln, i) =>
              i === 0
                ? `${chalk.yellow(S_BAR_END)}  ${chalk.yellow(ln)}`
                : `   ${ln}`,
            )
            .join('\n');
          return `${title}${chalk.yellow(S_BAR)}  ${this.options
            .map((option, i, options) => {
              const selected =
                this.value.includes(option.value) ||
                (option.group === true &&
                  this.isGroupSelected(`${option.value}`));
              const active = i === this.cursor;
              const groupActive =
                !active &&
                typeof option.group === 'string' &&
                this.options[this.cursor].value === option.group;
              if (groupActive) {
                return opt(
                  option,
                  selected ? 'group-active-selected' : 'group-active',
                  options,
                );
              }
              if (active && selected) {
                return opt(option, 'active-selected', options);
              }
              if (selected) {
                return opt(option, 'selected', options);
              }
              return opt(option, active ? 'active' : 'inactive', options);
            })
            .join(`\n${chalk.yellow(S_BAR)}  `)}\n${footer}\n`;
        }
        default: {
          return `${title}${chalk.cyan(S_BAR)}  ${this.options
            .map((option, i, options) => {
              const selected =
                this.value.includes(option.value) ||
                (option.group === true &&
                  this.isGroupSelected(`${option.value}`));
              const active = i === this.cursor;
              const groupActive =
                !active &&
                typeof option.group === 'string' &&
                this.options[this.cursor].value === option.group;
              if (groupActive) {
                return opt(
                  option,
                  selected ? 'group-active-selected' : 'group-active',
                  options,
                );
              }
              if (active && selected) {
                return opt(option, 'active-selected', options);
              }
              if (selected) {
                return opt(option, 'selected', options);
              }
              return opt(option, active ? 'active' : 'inactive', options);
            })
            .join(`\n${chalk.cyan(S_BAR)}  `)}\n${chalk.cyan(S_BAR_END)}\n`;
        }
      }
    },
  }).prompt() as Promise<Value[] | symbol>;
};
