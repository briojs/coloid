import { createGradient, createMultilineGradient } from '../src';

console.log(
  createMultilineGradient(
    ['orange', 'yellow'],
    ['  __', '<(o )___', ' ( ._> /', "  `---'"].join('\n'),
  ),
);

import { gradients } from '../src';

console.log(gradients.pastel('Hello, World!'));
