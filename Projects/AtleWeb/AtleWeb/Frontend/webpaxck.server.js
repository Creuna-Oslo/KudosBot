const path = require('path');
const SOURCE_DIR = path.resolve(__dirname, 'source');
const PUBLIC_DIR = path.resolve(__dirname, 'dist');

const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
/*
const config = {
  entry: SOURCE_DIR + '/server.js',
  output: {
    path: PUBLIC_DIR,
    filename: 'bundle.js'
  },
  devServer: {
    port: 8080,
    historyApiFallback: true
  }
};
*/
//module.exports = merge(baseConfig, config);
