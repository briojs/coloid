import type { InspectOptions } from 'node:util';
import defu from 'defu';
import { isDebug, isTest } from 'std-env';
import { LogLevel, LogLevels, LogType } from './consts.ts';
import { defaultPreset } from './presets/default.ts';
import { Preset } from './presets/preset.ts';
import {
  intro as _intro,
  note as _note,
  outro as _outro,
  confirmPrompt,
  multiselectPrompt,
  passwordPrompt,
  selectPrompt,
  textPrompt,
} from './prompts';

export const getDefaultLogLevel = (): LogLevel => {
  return isDebug ? LogLevels.debug : isTest ? LogLevels.warn : LogLevels.info;
};

export type ColoidOptions = {
  level?: LogLevel | LogType;
  tag?: string;
  presets?: Preset[];
  minCount?: number;
  throttle?: number;
  formatOptions?: InspectOptions;
};

export interface InputObject extends Partial<LogObject> {
  message?: string;
}

export type LogObject = {
  level: LogLevel;
  tag: string;
  type: LogType;
  args: any[];
  date: Date;
  [key: string]: unknown;
};

export type LogFunction = (input: InputObject | any, ...args: any[]) => void;

export type Coloid = Record<LogType, LogFunction> & _Coloid;

export interface ResolvedOptions {
  level: LogLevel;
  tag?: string;
  presets: Preset[];
  minCount: number;
  throttle: number;
  formatOptions: InspectOptions;
}

export class _Coloid {
  options: ResolvedOptions;
  _temp: {
    lastObj?: LogObject;
    lastTime?: Date;
    count?: number;
    serialized?: string;
    timeout?: ReturnType<typeof setTimeout>;
  };

  constructor(options: Partial<ColoidOptions> = {}) {
    const _options = defu(options, {
      level: getDefaultLogLevel(),
      throttle: 1000,
      minCount: 5,
      formatOptions: {},
    }) as ResolvedOptions;
    _options.presets = options.presets || [defaultPreset];

    _options.level = resolveLogLevel(options.level);

    this.options = _options;
    this._temp = {};

    for (const type in LogLevels) {
      const level = LogLevels[type as LogType];

      (this as any)[type] = this._log(type as LogType, level);
    }
  }

  _log(type: LogType, level: number) {
    return (...args: any[]) => {
      if (level > this.options.level) {
        return;
      }

      const obj: Partial<InputObject> = {
        date: new Date(),
        args: [],
        level,
        type,
        tag: this.options.tag,
      };

      if (
        args.length === 1 &&
        (args[0].args || args[0].message) &&
        !args[0].stack
      ) {
        Object.assign(obj, args[0]);
        args = args.splice(1);
      }

      obj.args = [...args];

      if (obj.message) {
        obj.args?.unshift(obj.message);
        delete obj.message;
      }

      obj.type = (obj.type?.toLowerCase() as LogType) || 'log';

      // Based on throttle from https://github.com/unjs/consola
      clearTimeout(this._temp.timeout);
      const diffTime =
        this._temp.lastTime && obj.date
          ? obj.date.getTime() - this._temp.lastTime.getTime()
          : 0;

      this._temp.lastTime = obj.date;

      if (diffTime < this.options.throttle) {
        const serializedLog = JSON.stringify([obj.type, obj.tag, obj.args]);
        const isSameObject = this._temp.serialized === serializedLog;
        this._temp.serialized = serializedLog;

        if (isSameObject) {
          this._temp.count = (this._temp.count || 0) + 1;

          if (this._temp.count >= this.options.minCount) {
            this._temp.timeout = setTimeout(
              this._handleLog(obj as LogObject, true),
              this.options.throttle,
            );
            return;
          }
        }
      }

      this._handleLog(obj as LogObject, false)();
    };
  }

  _handleLog(obj: LogObject, fromDelay: boolean) {
    return () => {
      const rep = (this._temp.count || 0) - this.options.minCount;

      if (rep > 1) {
        const args = [...(this._temp.lastObj?.args || [])];
        if (rep > 1) {
          args.push(`(x${rep})`);
        }
        // @ts-expect-error TODO: fix this
        this._presetLog({ ...this._temp.lastObj, args });
        this._temp.count = 1;
      }

      if (!fromDelay) {
        this._temp.lastObj = obj;
        this._presetLog(obj);
      }
    };
  }

  _presetLog(obj: LogObject) {
    for (const preset of this.options.presets) {
      preset.log(obj, this as unknown as Coloid);
    }
  }

  text = textPrompt;
  confirm = confirmPrompt;
  password = passwordPrompt;
  multiselect = multiselectPrompt;
  select = selectPrompt;

  intro = _intro;
  outro = _outro;
  note = _note;

  newTag(tag: string) {
    return createColoid({ ...this.options, tag });
  }
}

export const resolveLogLevel = (level: LogLevel | LogType | undefined) => {
  return level === undefined
    ? getDefaultLogLevel()
    : typeof level === 'string'
      ? LogLevels[level]
      : level;
};

export const createColoid = (options: Partial<ColoidOptions> = {}): Coloid => {
  return new _Coloid(options) as Coloid;
};
