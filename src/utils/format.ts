import chalk from 'chalk';

/**
 * **text** will be bold
 * `text` will become cyan
 * _text_ will be underlined
 */
export const formatText = (text: string) => {
  return text
    .replaceAll(/\*\*(.*?)\*\*/g, (_, p1) => chalk.bold(p1))
    .replaceAll(/`(.*?)`/g, (_, p1) => chalk.cyan(p1))
    .replaceAll(/_(.*?)_/g, (_, p1) => chalk.underline(p1));
};
