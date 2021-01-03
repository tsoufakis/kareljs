const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
      filename: 'appbundle.js',
      path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json']
  }
};
