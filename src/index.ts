import { createColoid } from './coloid.ts';

export * from './coloid';
export * from './utils';
export * from './prompts/spinner';
export * from './prompts/group';
export * from './prompts/log';
export * from './presets/preset';
export * from './presets/default';

export const coloid = createColoid({});
