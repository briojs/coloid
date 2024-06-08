import { foregroundColorNames } from 'chalk';
import defu from 'defu';
import stripAnsi from 'strip-ansi';
import { colorText } from './colors.ts';

export type BoxType = {
  topLeft: string;
  top: string;
  topRight: string;
  right: string;
  bottomRight: string;
  bottom: string;
  bottomLeft: string;
  left: string;
};

export type BoxTypes =
  | 'round'
  | 'single'
  | 'double'
  | 'bold'
  | 'singleDouble'
  | 'doubleSingle'
  | 'classic'
  | 'arrow';

// https://github.com/sindresorhus/cli-boxes/blob/main/boxes.json
export const boxes: Record<BoxTypes, BoxType> = {
  single: {
    topLeft: '┌',
    top: '─',
    topRight: '┐',
    right: '│',
    bottomRight: '┘',
    bottom: '─',
    bottomLeft: '└',
    left: '│',
  },
  double: {
    topLeft: '╔',
    top: '═',
    topRight: '╗',
    right: '║',
    bottomRight: '╝',
    bottom: '═',
    bottomLeft: '╚',
    left: '║',
  },
  round: {
    topLeft: '╭',
    top: '─',
    topRight: '╮',
    right: '│',
    bottomRight: '╯',
    bottom: '─',
    bottomLeft: '╰',
    left: '│',
  },
  bold: {
    topLeft: '┏',
    top: '━',
    topRight: '┓',
    right: '┃',
    bottomRight: '┛',
    bottom: '━',
    bottomLeft: '┗',
    left: '┃',
  },
  singleDouble: {
    topLeft: '╓',
    top: '─',
    topRight: '╖',
    right: '║',
    bottomRight: '╜',
    bottom: '─',
    bottomLeft: '╙',
    left: '║',
  },
  doubleSingle: {
    topLeft: '╒',
    top: '═',
    topRight: '╕',
    right: '│',
    bottomRight: '╛',
    bottom: '═',
    bottomLeft: '╘',
    left: '│',
  },
  classic: {
    topLeft: '+',
    top: '-',
    topRight: '+',
    right: '|',
    bottomRight: '+',
    bottom: '-',
    bottomLeft: '+',
    left: '|',
  },
  arrow: {
    topLeft: '↘',
    top: '↓',
    topRight: '↙',
    right: '←',
    bottomRight: '↖',
    bottom: '↑',
    bottomLeft: '↗',
    left: '→',
  },
};

export type BoxStyle = {
  type: BoxTypes;
  borderColor: typeof foregroundColorNames;
  verticalAlign: 'top' | 'center' | 'bottom';
  padding: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
};

export type BoxOptions = {
  title?: string;
  content: string;
  style: Partial<BoxStyle>;
};

export const box = (options: BoxOptions) => {
  const style = defu(options.style, {
    type: 'round',
    borderColor: 'white',
    verticalAlign: 'center',
    padding: 1,
    marginTop: 1,
    marginBottom: 1,
    marginLeft: 1,
  }) as Required<BoxOptions['style']>;
  options.style = style;

  const border: BoxType = {
    ...(boxes[style.type as BoxTypes] || boxes.round),
  };

  for (const key in border) {
    border[key as keyof BoxType] = colorText(
      border[key as keyof BoxType],
      style.borderColor as unknown as string,
    );
  }
  const lines = options.content.split('\n');
  const dimensions = getDimensions(
    style as Required<BoxOptions['style']>,
    lines,
  );
  const boxLines = [];

  if (style.marginTop > 0) {
    boxLines.push(''.repeat(style.marginTop));
  }

  boxLines.push(getTopLine(options, dimensions, border));

  let valignOffset =
    dimensions.height -
    lines.length -
    (style.verticalAlign === 'top' ? dimensions.paddingOffset : 0);
  if (style.verticalAlign === 'center') {
    valignOffset = Math.floor((dimensions.height - lines.length) / 2);
  }

  for (let i = 0; i < dimensions.height; i++) {
    if (i < valignOffset || i >= valignOffset + lines.length) {
      boxLines.push(
        `${dimensions.leftSpace}${border.left}${' '.repeat(dimensions.widthOffset)}${
          border.left
        }`,
      );
    } else {
      boxLines.push(
        getLine(
          lines[i - valignOffset] || '',
          dimensions,
          border,
          dimensions.leftSpace,
        ),
      );
    }
  }

  boxLines.push(getBottomLine(options, dimensions, border));

  if (style.marginBottom > 0) {
    boxLines.push(''.repeat(style.marginBottom));
  }

  return boxLines.join('\n');
};

const getBottomLine = (
  options: BoxOptions,
  dimensions: Dimensions,
  border: BoxType,
) => {
  return `${dimensions.leftSpace}${border.bottomLeft}${border.bottom.repeat(
    dimensions.widthOffset,
  )}${border.bottomRight}`;
};

const getLine = (
  line: string,
  dimensions: Dimensions,
  border: BoxType,
  leftSpace: string,
) => {
  const left = ' '.repeat(dimensions.paddingOffset);
  const right = ' '.repeat(dimensions.width - stripAnsi(line).length);
  return `${leftSpace}${border.left}${left}${line}${right}${border.left}`;
};

const getTopLine = (
  options: BoxOptions,
  dimensions: Dimensions,
  border: BoxType,
) => {
  if (options.title) {
    const title = options.style.borderColor
      ? //   @ts-expect-error Chalk
        colorText(options.title, options.style.borderColor)
      : options.title;
    const left = border.top.repeat(
      Math.floor((dimensions.width - stripAnsi(options.title).length) / 2),
    );
    const right = border.top.repeat(
      dimensions.width -
        stripAnsi(options.title).length -
        stripAnsi(left).length +
        dimensions.paddingOffset,
    );
    return `${dimensions.leftSpace}${border.topLeft}${left}${title}${right}${border.topRight}`;
  }

  return `${dimensions.leftSpace}${border.topLeft}${border.top.repeat(
    dimensions.widthOffset,
  )}${border.topRight}`;
};

type Dimensions = ReturnType<typeof getDimensions>;

const getDimensions = (
  options: Required<BoxOptions['style']>,
  lines: string[],
) => {
  const paddingOffset =
    options.padding % 2 === 0 ? options.padding : options.padding + 1;
  const height = lines.length + paddingOffset;
  const width = Math.max(...lines.map((line) => line.length)) + paddingOffset;
  const widthOffset = width + paddingOffset;

  const leftSpace =
    options.marginLeft > 0 ? ' '.repeat(options.marginLeft) : '';

  return {
    height,
    width,
    widthOffset,
    leftSpace,
    paddingOffset,
  };
};
