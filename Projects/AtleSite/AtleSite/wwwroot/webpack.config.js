const path = require('path');
module.exports = {
  entry: './source/tutorial.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{ test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ }]
  },
  resolve: {
    extensions: ['.jsx', '.js', '.scss']
  }
};
