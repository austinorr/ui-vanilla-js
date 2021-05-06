const path = require("path");

module.exports = {
  entry: {
    main: ["./src/index.js"],
  },
  mode: "none",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "./build"),
    library: "ui",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node-modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path]/[name].[ext]",
            },
          },
        ],
      },
    ],
  },
};
