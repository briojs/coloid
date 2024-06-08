## ✨ coloid

> Beautiful console logger

[![npm version](https://img.shields.io/npm/v/coloid?color=yellow)](https://npmjs.com/package/coloid)
[![npm downloads](https://img.shields.io/npm/dm/coloid?color=yellow)](https://npmjs.com/package/coloid)
[![bundle size](https://img.shields.io/bundlephobia/minzip/coloid?color=yellow)](https://bundlephobia.com/package/coloid)
[![license](https://img.shields.io/github/license/briojs/coloid?color=yellow)](https://github.com/briojs/coloid/blob/main/LICENSE)

### Install

```sh
# npm
npm install -D coloid

# yarn
yarn add -D coloid

# pnpm
pnpm install -D coloid

# bun
bun install -D coloid
```

### Usage

Import and use `coloid` or `createColoid` function to create new instance.

```ts
import { coloid, createColoid } from "coloid";

const newColoid = createColoid({
  // options
});

coloid.info("Hello, world!");

newColoid.info("Hello, world!");
```

### Levels

- `fatal`, `error`, `warn`, `box`, `log`, `info`, `success`, `fail`, `ready`, `debug`, `trace`

### Boxes

```ts
coloid.box(`New version available: 1.0.0`);

coloid.box({
  title: "New version available",
  message: `You can update to 1.0.0`,
  style: {
    borderColor: "brightYellow",
  },
});
```

#### Options

```ts
export type BoxStyle = {
  type: BoxTypes;
  borderColor: typeof foregroundColorNames;
  verticalAlign: "top" | "center" | "bottom";
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
```

These are border styles available:

- `single`, `double`, `round`, `bold`, `singleDouble`, `doubleSingle`, `classic`, `arrow`

### Prompts

Prompts are based on `@clack/prompts` package from https://github.com/natemoo-re/clack

```ts
coloid.intro("Welcome to the project setup!");

const projectType = await coloid.select({
  message: "Pick a project type.",
  options: [
    { value: "ts", label: "TypeScript" },
    { value: "js", label: "JavaScript" },
    { value: "coffee", label: "CoffeeScript", hint: "oh no" },
  ],
});

coloid.outro("Project setup completed!");
```

### Custom presets

Presets are responsible for logging object to the console.

```ts
export const customPreset: Preset = {
  log: (obj, coloid) => {
    console.log(obj.type, obj.message);
  },
};

const newColoid = createColoid({
  presets: [customPreset],
});
```

Published under the [MIT](https://github.com/briojs/coloid/blob/main/LICENSE) license.
Made by [@malezjaa](https://github.com/briojs)
and [community](https://github.com/briojs/coloid/graphs/contributors) 💛
<br><br>
<a href="https://github.com/briojs/coloid/graphs/contributors">
<img src="https://contrib.rocks/image?repo=briojs/coloid" />
</a>

```

```
