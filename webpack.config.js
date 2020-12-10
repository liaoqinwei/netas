let path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode:"development",
  output: {
    filename: "netas.js",
    path: path.join(__dirname, "bin")
  },
  entry: "/src/index.ts",
  module: {
    rules: [
      {
        test: /\.[j|t]s/,
        exclude: /node_modules/,
        loader: "ts-loader",
      },
    ]
  },
  resolve: {
    extensions: ['.js','.ts']
  },
}