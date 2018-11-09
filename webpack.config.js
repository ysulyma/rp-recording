const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  entry: `${__dirname}/src/plugin.tsx`,
  output: {
    filename: 'ractive-editor.js',
    path: `${__dirname}/dist`,
    library: 'RactiveEditor'
  },

  externals: {
    "chrome": "chrome",
    "mathjax": "MathJax",
    "prop-types": "PropTypes",
    "ractive-player": "RactivePlayer",
    "react": "React",
    "react-dom": "ReactDOM",
    "three": "THREE"
  },

  mode: process.env.NODE_ENV,

  module: {
    rules: [
     {
        test: /\.[jt]sx?$/,
        loader: "awesome-typescript-loader",
        options: {
          configFileName: `${__dirname}/tsconfig.json`
        }
      }
    ]
  },

  plugins: [
    new CheckerPlugin()
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
  }
};
