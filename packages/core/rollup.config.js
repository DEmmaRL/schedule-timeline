import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        importHelpers: true,
      }),
    ],
    external: ['tslib'],
  },
  {
    input: 'src/ics.ts',
    output: [
      {
        file: 'dist/ics.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/ics.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        importHelpers: true,
      }),
    ],
    external: ['tslib'],
  },
  {
    input: 'src/web-component.ts',
    output: [
      {
        file: 'dist/web-component.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/web-component.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        importHelpers: true,
      }),
    ],
    external: ['tslib'],
  },
];