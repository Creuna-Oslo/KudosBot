const HtmlPlugin = require('html-webpack-plugin');

const path = require('path');
const SOURCE_DIR = path.resolve(__dirname, 'source');
const PUBLIC_DIR = path.resolve(__dirname, 'dist');

module.exports = {
  entry: SOURCE_DIR + '/index.js',
  output: {
    path: PUBLIC_DIR,
    filename: 'bundle.js'
  },
  devServer: {
    port: 8080,
    historyApiFallback: true
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  resolve: { extensions: ['.js', '.jsx'] },
  plugins: [
    new HtmlPlugin({
      template: __dirname + '/source/index.html'
    })
  ]
};
