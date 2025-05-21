// webpack.config.js
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/server.js', // file khởi động chính
  target: 'node', // vì build cho Node.js
  mode: 'production', // hoặc 'development' nếu debug
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  externals: [nodeExternals()], // bỏ qua node_modules khi đóng gói
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // nếu bạn cần xử lý mã ES6+
        },
      },
    ],
  },
};
