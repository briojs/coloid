// Ported from https://github.com/bokub/gradient-string

import chalk from 'chalk';
import tinygradient from 'tinygradient';

const forbiddenChars = /\s/g;

export type Options = {
  interpolation?: string;
  hsvSpin?: string;
};

export const createGradient = (
  colors: string[],
  str: string,
  opts?: Options,
): string => {
  return applyGradient(str ? str.toString() : '', colors, opts);
};

export const createMultilineGradient = (
  colors: string[],
  str: string,
  opts?: Options,
): string => {
  return multilineGradient(str ? str.toString() : '', colors, opts);
};

const getColors = (gradient: any, options: Options, count: number) =>
  options.interpolation?.toLowerCase() === 'hsv'
    ? gradient.hsv(count, options.hsvSpin?.toLowerCase())
    : gradient.rgb(count);

const applyGradient = (str: string, grad: any[], opts?: Options): string => {
  const gradient = tinygradient(grad);
  const options = validateOptions(opts);
  const colorsCount = Math.max(
    str.replaceAll(forbiddenChars, '').length,
    gradient.stops.length,
  );
  const colors = getColors(gradient, options, colorsCount);
  let result = '';
  for (const s of str) {
    result += forbiddenChars.test(s)
      ? s
      : chalk.hex(colors.shift()?.toHex() || '#000000')(s);
  }
  return result;
};

const multilineGradient = (
  str: string,
  grad: any[],
  opts?: Options,
): string => {
  const gradient = tinygradient(grad);
  const options = validateOptions(opts);
  const lines = str.split('\n');
  const maxLength = Math.max(
    ...lines.map((l) => l.length),
    gradient.stops.length,
  );
  const colors = [...getColors(gradient, options, maxLength)];
  const results = [];
  for (const line of lines) {
    const lineColors = [...colors];
    let lineResult = '';
    for (const l of line) {
      lineResult += chalk.hex(lineColors.shift()?.toHex() || '#000000')(l);
    }
    results.push(lineResult);
  }
  return results.join('\n');
};

const validateOptions = (opts?: Options): Options => {
  const options: Options = { interpolation: 'rgb', hsvSpin: 'short', ...opts };
  if (opts !== undefined && typeof opts !== 'object') {
    throw new TypeError(
      `Expected \`options\` to be an \`object\`, got \`${typeof opts}\``,
    );
  }

  if (typeof options.interpolation !== 'string') {
    throw new TypeError(
      `Expected \`options.interpolation\` to be a \`string\`, got \`${typeof options.interpolation}\``,
    );
  }

  if (
    options.interpolation.toLowerCase() === 'hsv' &&
    typeof options.hsvSpin !== 'string'
  ) {
    throw new TypeError(
      `Expected \`options.hsvSpin\` to be a \`string\`, got \`${typeof options.hsvSpin}\``,
    );
  }
  return options;
};

const aliases: Record<
  BuiltinGradients,
  { colors: string[]; options: Options }
> = {
  atlas: { colors: ['#feac5e', '#c779d0', '#4bc0c8'], options: {} },
  cristal: { colors: ['#bdfff3', '#4ac29a'], options: {} },
  teen: { colors: ['#77a1d3', '#79cbca', '#e684ae'], options: {} },
  mind: { colors: ['#473b7b', '#3584a7', '#30d2be'], options: {} },
  morning: {
    colors: ['#ff5f6d', '#ffc371'],
    options: { interpolation: 'hsv' },
  },
  vice: { colors: ['#5ee7df', '#b490ca'], options: { interpolation: 'hsv' } },
  passion: { colors: ['#f43b47', '#453a94'], options: {} },
  fruit: { colors: ['#ff4e50', '#f9d423'], options: {} },
  instagram: { colors: ['#833ab4', '#fd1d1d', '#fcb045'], options: {} },
  retro: {
    colors: [
      '#3f51b1',
      '#5a55ae',
      '#7b5fac',
      '#8f6aae',
      '#a86aa4',
      '#cc6b8e',
      '#f18271',
      '#f3a469',
      '#f7c978',
    ],
    options: {},
  },
  summer: { colors: ['#fdbb2d', '#22c1c3'], options: {} },
  rainbow: {
    colors: ['#ff0000', '#ff0100'],
    options: { interpolation: 'hsv', hsvSpin: 'long' },
  },
  pastel: {
    colors: ['#74ebd5', '#74ecd5'],
    options: { interpolation: 'hsv', hsvSpin: 'long' },
  },
};

export type BuiltinGradients =
  | 'atlas'
  | 'cristal'
  | 'teen'
  | 'mind'
  | 'morning'
  | 'vice'
  | 'passion'
  | 'fruit'
  | 'instagram'
  | 'retro'
  | 'summer'
  | 'rainbow'
  | 'pastel';

const gradientFunctions: any = {};

for (const alias in aliases) {
  const { colors, options } = aliases[alias as BuiltinGradients];
  gradientFunctions[alias] = (str: string) =>
    createGradient(colors, str, options);
}

export const gradients = gradientFunctions as Record<
  BuiltinGradients,
  (str: string) => string
>;
