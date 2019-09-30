const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: `${__dirname}/src/plugin.tsx`,
  output: {
    filename: process.env.NODE_ENV === "development" ? "ractive-editor.js" : "ractive-editor.min.js",
    path: `${__dirname}/dist`,
    library: "RactiveEditor"
  },

  devtool: false,

  externals: {
    "ractive-player": "RactivePlayer",
    "react": "React",
    "react-dom": "ReactDOM"
  },

  mode: process.env.NODE_ENV,

  module: {
    rules: [
     {
        test: /\.[jt]sx?$/,
        loader: "ts-loader"
      }
    ]
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          safari10: true
        }
      })
    ],
    noEmitOnErrors: false
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: () => require("fs").readFileSync("./LICENSE", {encoding: "utf8"})
    })
  ],

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
  }
};
