import { isCancel } from '@clack/core';
import { spinner } from './spinner.ts';

export type PromptGroupAwaitedReturn<T> = {
  [P in keyof T]: Exclude<Awaited<T[P]>, symbol>;
};

export interface PromptGroupOptions<T> {
  /**
   * Control how the group can be canceled
   * if one of the prompts is canceled.
   */
  onCancel?: (opts: {
    results: Prettify<Partial<PromptGroupAwaitedReturn<T>>>;
  }) => void;
}

type Prettify<T> = {
  [P in keyof T]: T[P];
} & {};

export type PromptGroup<T> = {
  [P in keyof T]: (opts: {
    results: Prettify<Partial<PromptGroupAwaitedReturn<Omit<T, P>>>>;
  }) => void | Promise<T[P] | void>;
};

/**
 * Define a group of prompts to be displayed
 * and return a results of objects within the group
 */
export const group = async <T>(
  prompts: PromptGroup<T>,
  opts?: PromptGroupOptions<T>,
): Promise<Prettify<PromptGroupAwaitedReturn<T>>> => {
  const results = {} as any;
  const promptNames = Object.keys(prompts);

  for (const name of promptNames) {
    const prompt = prompts[name as keyof T];
    const result = await prompt({ results })?.catch((e) => {
      throw e;
    });

    // Pass the results to the onCancel function
    // so the user can decide what to do with the results
    // TODO: Switch to callback within core to avoid isCancel Fn
    if (typeof opts?.onCancel === 'function' && isCancel(result)) {
      results[name] = 'canceled';
      opts.onCancel({ results });
      continue;
    }

    results[name] = result;
  }

  return results;
};

export type Task = {
  /**
   * Task title
   */
  title: string;
  /**
   * Task function
   */
  task: (
    message: (string: string) => void,
  ) => string | Promise<string> | void | Promise<void>;

  /**
   * If enabled === false the task will be skipped
   */
  enabled?: boolean;
};

/**
 * Define a group of tasks to be executed
 */
export const tasks = async (tasks: Task[]) => {
  for (const task of tasks) {
    if (task.enabled === false) continue;

    const s = spinner();
    s.start(task.title);
    const result = await task.task(s.message);
    s.stop(result || task.title);
  }
};
