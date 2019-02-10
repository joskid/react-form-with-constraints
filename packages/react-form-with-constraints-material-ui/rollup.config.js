// @ts-check

import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import { gzip as zopfli } from 'node-zopfli';
import gzip from 'rollup-plugin-gzip';
import filesize from 'rollup-plugin-filesize';
import strip from 'rollup-plugin-strip';

const __PROD__ = process.env.NODE_ENV === 'production';

function outputFileName() {
  let fileName = `react-form-with-constraints-material-ui.${process.env.NODE_ENV}`;
  fileName += __PROD__ ? '.min.js' : '.js';
  return fileName;
}

export default {
  input: './src/index.ts',
  output: {
    file: `dist/${outputFileName()}`,
    name: 'ReactFormWithConstraintsMaterialUI',
    format: 'umd',
    sourcemap: true,
    globals: {
      'react-form-with-constraints': 'ReactFormWithConstraints',
      '@material-ui/core': 'material-ui', // FIXME See UMD package: export MaterialUI variable https://github.com/mui-org/material-ui/issues/12387
      react: 'React',
      'prop-types': 'PropTypes'
    }
  },

  external: ['react-form-with-constraints', '@material-ui/core', 'react', 'prop-types'],

  plugins: [
    typescript({
      clean: true,
      tsconfig: 'tsconfig.lib-es5.json',
      tsconfigOverride: {compilerOptions: {module: 'esnext', inlineSources: false}}
    }),

    __PROD__ && uglify(),

    gzip({
      customCompression: content => zopfli(Buffer.from(content))
    }),

    filesize(),

    __PROD__ && strip({
      include: ['**/*.js', '**/*.ts', '**/*.tsx'] // See https://github.com/rollup/rollup-plugin-strip/pull/7
    })
  ]
};
