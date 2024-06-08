export type LogLevel = 0 | 1 | 2 | 3 | 4 | 5 | (number & {});

export const LogLevels: Record<LogType, number> = {
  fatal: 0,
  error: 0,
  warn: 1,
  log: 2,
  box: 2,
  info: 3,
  success: 3,
  fail: 3,
  ready: 3,
  debug: 4,
  trace: 5,
};

export type LogType =
  | 'fatal'
  | 'error'
  | 'warn'
  | 'box'
  | 'log'
  | 'info'
  | 'success'
  | 'fail'
  | 'ready'
  | 'debug'
  | 'trace';
