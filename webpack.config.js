let path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  output: {
    filename: "bundle.js",
    path: path.join(__dirname,"dist")
  },
  entry: "/src/index.ts",
  module: {
    rules: [
      {
        test: /\.[j|t]s/,
        exclude: /node_modules/,
        use:{
          loader: "babel-loader",
          options:{
            presets:["@babel/typescript"],
            plugins:['syntax-dynamic-import','transform-class-properties']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js','.ts']
  },
  plugins: [
      new UglifyJsPlugin({uglifyOptions:{mangle:false}})
  ]

}
