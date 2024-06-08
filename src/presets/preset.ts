import { Coloid, LogObject } from '../coloid.ts';

export type Preset = {
  log: (obj: LogObject, coloid: Coloid) => void;
};
