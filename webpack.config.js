let path = require('path')

module.exports = {
  mode:"development",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist")
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
    extensions: ['.js', '.ts']
  }

}
