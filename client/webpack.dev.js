const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
      allowedHosts: ['www.kareljs.com'],
      clientLogLevel: 'debug',
      publicPath: '/static/',
      contentBase: path.join(__dirname, 'public'),
      contentBasePublicPath: ['/static/', '/'],
      historyApiFallback: true,
      port: 8080,
      host: '0.0.0.0'
  }
});
