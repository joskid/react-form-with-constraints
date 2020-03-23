import path from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';

const output = {
  path: path.join(__dirname, 'build'),
  filename: '[name].js'
};

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const babelLoaderRule = { test: /\.tsx?$/, loader: 'babel-loader' };

const config: Configuration[] = [
  {
    entry: { server: './server.tsx' },

    // [How can I use webpack with express?](https://stackoverflow.com/a/31655760/990356)
    target: 'node',

    // https://youtu.be/duhudXkHRf4?t=1062
    externals: [nodeExternals()],

    output,
    resolve: { extensions },
    module: {
      rules: [
        babelLoaderRule,
        { test: /\.(html|css)$/, loader: 'file-loader', options: { name: '[name].[ext]' } }
      ]
    }
  },

  {
    entry: { browser: './browser.tsx' },
    output,
    resolve: { extensions },
    module: {
      rules: [babelLoaderRule]
    }
  }
];

export default config;
