import { fallbackSymbols, mainSymbols } from 'figures';
import isUnicodeSupported from 'is-unicode-supported';
import { LogType } from '../consts.ts';

const unicode = isUnicodeSupported();
const s = (c: string, fallback: string) => (unicode ? c : fallback);

export const typesIcons: { [k in LogType]?: string } = {
  error: s(mainSymbols.cross, fallbackSymbols.cross),
  fatal: s(mainSymbols.cross, fallbackSymbols.cross),
  ready: s(mainSymbols.tick, fallbackSymbols.tick),
  warn: s(mainSymbols.warning, fallbackSymbols.warning),
  info: s(mainSymbols.info, fallbackSymbols.info),
  success: s(mainSymbols.tick, fallbackSymbols.tick),
  trace: s(mainSymbols.arrowRight, fallbackSymbols.arrowRight),
  fail: s(mainSymbols.cross, fallbackSymbols.cross),
  debug: s('⚙', 'D'),
  log: '',
};
