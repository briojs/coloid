import { State } from '@clack/core';
import chalk from 'chalk';
import isUnicodeSupported from 'is-unicode-supported';

export const unicode = isUnicodeSupported();
export const s = (c: string, fallback: string) => (unicode ? c : fallback);
export const S_STEP_ACTIVE = s('◆', '*');
export const S_STEP_CANCEL = s('■', 'x');
export const S_STEP_ERROR = s('▲', 'x');
export const S_STEP_SUBMIT = s('◇', 'o');

export const S_BAR_START = s('┌', 'T');
export const S_BAR = s('│', '|');
export const S_BAR_END = s('└', '—');

export const S_RADIO_ACTIVE = s('●', '>');
export const S_RADIO_INACTIVE = s('○', ' ');
export const S_CHECKBOX_ACTIVE = s('◻', '[•]');
export const S_CHECKBOX_SELECTED = s('◼', '[+]');
export const S_CHECKBOX_INACTIVE = s('◻', '[ ]');
export const S_PASSWORD_MASK = s('▪', '•');

export const S_BAR_H = s('─', '-');
export const S_CORNER_TOP_RIGHT = s('╮', '+');
export const S_CONNECT_LEFT = s('├', '+');
export const S_CORNER_BOTTOM_RIGHT = s('╯', '+');

export const symbol = (state: State) => {
  switch (state) {
    case 'initial':
    case 'active': {
      return chalk.cyan(S_STEP_ACTIVE);
    }
    case 'cancel': {
      return chalk.red(S_STEP_CANCEL);
    }
    case 'error': {
      return chalk.yellow(S_STEP_ERROR);
    }
    case 'submit': {
      return chalk.green(S_STEP_SUBMIT);
    }
  }
};

interface LimitOptionsParams<TOption> {
  options: TOption[];
  maxItems: number | undefined;
  cursor: number;
  style: (option: TOption, active: boolean) => string;
}

export const limitOptions = <TOption>(
  params: LimitOptionsParams<TOption>,
): string[] => {
  const { cursor, options, style } = params;

  const paramMaxItems = params.maxItems ?? Infinity;
  const outputMaxItems = Math.max(process.stdout.rows - 4, 0);
  // We clamp to minimum 5 because anything less doesn't make sense UX wise
  const maxItems = Math.min(outputMaxItems, Math.max(paramMaxItems, 5));
  let slidingWindowLocation = 0;

  if (cursor >= slidingWindowLocation + maxItems - 3) {
    slidingWindowLocation = Math.max(
      Math.min(cursor - maxItems + 3, options.length - maxItems),
      0,
    );
  } else if (cursor < slidingWindowLocation + 2) {
    slidingWindowLocation = Math.max(cursor - 2, 0);
  }

  const shouldRenderTopEllipsis =
    maxItems < options.length && slidingWindowLocation > 0;
  const shouldRenderBottomEllipsis =
    maxItems < options.length &&
    slidingWindowLocation + maxItems < options.length;

  return options
    .slice(slidingWindowLocation, slidingWindowLocation + maxItems)
    .map((option, i, arr) => {
      const isTopLimit = i === 0 && shouldRenderTopEllipsis;
      const isBottomLimit = i === arr.length - 1 && shouldRenderBottomEllipsis;
      return isTopLimit || isBottomLimit
        ? chalk.dim('...')
        : style(option, i + slidingWindowLocation === cursor);
    });
};

export type Primitive = Readonly<string | boolean | number>;

export type Option<Value> = Value extends Primitive
  ? { value: Value; label?: string; hint?: string }
  : { value: Value; label: string; hint?: string };
