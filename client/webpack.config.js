const path = require('path')

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
  },
  devtool: 'eval-source-map',
  devServer: {
      clientLogLevel: 'debug',
      publicPath: '/static/',
      contentBase: path.join(__dirname, 'public'),
      contentBasePublicPath: ['/static/', '/'],
      historyApiFallback: true,
      port: 8080,
      host: '0.0.0.0'
  }
};
