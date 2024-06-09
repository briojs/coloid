import { formatWithOptions } from 'node:util';
import chalk from 'chalk';
import {
  colorBackground,
  colorText,
  stackWithColors,
  stringWidth,
  typesColors,
  typesIcons,
} from '../utils';
import { formatText } from '../utils';
import { BoxOptions, box } from '../utils/boxes.ts';
import { Preset } from './preset.ts';

export const defaultPreset: Preset = {
  log: (obj, coloid) => {
    const [message, ...extra] = formatWithOptions(
      coloid.options.formatOptions,
      ...obj.args.map((arg) => {
        if (arg && typeof arg.stack === 'string') {
          return arg.message + stackWithColors(arg.stack, obj.type);
        }
        return arg;
      }),
    ).split('\n');
    const stream = obj.level < 2 ? process.stderr : process.stdout;

    if (obj.type === 'box') {
      return stream.write(
        box({
          content: formatText(
            message + (extra.length > 0 ? '\n' + extra.join('\n') : ''),
          ),
          title: obj.title ? formatText(obj.title as string) : undefined,
          style: obj.style as BoxOptions['style'],
        }),
      );
    }

    let line = '';
    const icon =
      obj.level < 2
        ? colorBackground(
            ` ${colorText(obj.type.toUpperCase(), 'black')} `,
            typesColors[obj.type] as string,
          )
        : colorText(typesIcons[obj.type], typesColors[obj.type]);
    const leftSide = `${icon ? `${icon} ` : ''}${formatText(message)}`;
    const rightSide = `${obj.tag ? chalk.gray(obj.tag) + ' ' : ''}${chalk.gray(obj.date.toLocaleTimeString())}`;
    const columns = process.stdout.columns || 0;
    const space = columns - stringWidth(leftSide) - stringWidth(rightSide) - 2;

    line =
      space > 0 && columns >= 80
        ? leftSide + ' '.repeat(space) + rightSide
        : (rightSide ? `${chalk.gray(`[${rightSide}]`)} ` : '') + leftSide;

    line += formatText(extra.length > 0 ? '\n' + extra.join('\n') : '');

    if (obj.type === 'trace') {
      const _err = new Error('Trace: ' + obj.message);
      line += stackWithColors(_err.stack || '', obj.type);
    }

    return stream.write(obj.level < 2 ? '\n' + line + '\n\n' : line + '\n');
  },
};
