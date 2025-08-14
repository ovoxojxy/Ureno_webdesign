import postcss from 'rollup-plugin-postcss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  input: 'src/main.jsx',
  output: {
    file: 'dist/bundle.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    alias({
        entries: [
            { find: '@', replacement: path.resolve(__dirname, 'src')}
        ]
    }),
    resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx'],
      exclude: 'node_modules/**',
    }),
    typescript({ tsconfig: './tsconfig.json'}),
    postcss({
      extract: true, // Extract CSS to separate file
      minimize: true,
      sourceMap: true,
    }),
    visualizer({ filename: 'stats.html', open: true }),
  ],
};