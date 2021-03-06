import path from 'path';
import { Configuration } from 'webpack';

const config: Configuration = {
  entry: './App.tsx',

  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx']
  },

  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'babel-loader' },
      { test: /\.html$/, loader: 'file-loader', options: { name: '[path][name].[ext]' } }
    ]
  }
};

export default config;
