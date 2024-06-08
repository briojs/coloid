import { block } from '@clack/core';
import chalk from 'chalk';
import { cursor, erase } from 'sisteransi';
import {
  S_BAR,
  S_STEP_CANCEL,
  S_STEP_ERROR,
  S_STEP_SUBMIT,
  unicode,
} from './utils.ts';

export const spinner = () => {
  const frames = unicode ? ['◒', '◐', '◓', '◑'] : ['•', 'o', 'O', '0'];
  const delay = unicode ? 80 : 120;

  let unblock: () => void;
  let loop: Timer;
  let isSpinnerActive: boolean = false;
  let _message: string = '';

  const handleExit = (code: number) => {
    const msg = code > 1 ? 'Something went wrong' : 'Canceled';
    if (isSpinnerActive) stop(msg, code);
  };

  const errorEventHandler = () => handleExit(2);
  const signalEventHandler = () => handleExit(1);

  const registerHooks = () => {
    process.on('uncaughtExceptionMonitor', errorEventHandler);
    process.on('unhandledRejection', errorEventHandler);
    process.on('SIGINT', signalEventHandler);
    process.on('SIGTERM', signalEventHandler);
    process.on('exit', handleExit);
  };

  const clearHooks = () => {
    process.removeListener('uncaughtExceptionMonitor', errorEventHandler);
    process.removeListener('unhandledRejection', errorEventHandler);
    process.removeListener('SIGINT', signalEventHandler);
    process.removeListener('SIGTERM', signalEventHandler);
    process.removeListener('exit', handleExit);
  };

  const start = (msg: string = ''): void => {
    isSpinnerActive = true;
    unblock = block();
    _message = msg.replace(/\.+$/, '');
    process.stdout.write(`${chalk.gray(S_BAR)}\n`);

    let frameIndex = 0;
    let dotsTimer = 0;

    registerHooks();

    loop = setInterval(() => {
      const frame = chalk.magenta(frames[frameIndex]);
      const loadingDots = '.'.repeat(Math.floor(dotsTimer)).slice(0, 3);
      process.stdout.write(cursor.move(-999, 0));
      process.stdout.write(erase.down(1));
      process.stdout.write(`${frame}  ${_message}${loadingDots}`);
      frameIndex = frameIndex + 1 < frames.length ? frameIndex + 1 : 0;
      dotsTimer = dotsTimer < frames.length ? dotsTimer + 0.125 : 0;
    }, delay);
  };

  const stop = (msg: string = '', code: number = 0): void => {
    _message = msg ?? _message;
    isSpinnerActive = false;
    clearInterval(loop);

    const step =
      code === 0
        ? chalk.green(S_STEP_SUBMIT)
        : code === 1
          ? chalk.red(S_STEP_CANCEL)
          : chalk.red(S_STEP_ERROR);

    process.stdout.write(cursor.move(-999, 0));
    process.stdout.write(erase.down(1));
    process.stdout.write(`${step}  ${_message}\n`);

    clearHooks();
    unblock();
  };

  const message = (msg: string = ''): void => {
    _message = msg ?? _message;
  };

  return {
    start,
    stop,
    message,
  };
};
