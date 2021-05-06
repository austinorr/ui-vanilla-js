// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

const path = require("path");
const env = require("dotenv").config();
console.log(env);

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: { src: "/" },
  plugins: [
    "@snowpack/plugin-postcss",
    "@local/snowpack-css-refresh-plugin",
    [
      "@snowpack/plugin-run-script",
      {
        cmd: "postcss ./src/css/tw.css -o ./build/css/tw.css --no-source-map", // production build command
        watch:
          "postcss --watch ./src/css/tw.css -o ./build/css/tw.css --no-source-map", // (optional) dev server command
      },
    ],
    [
      "@snowpack/plugin-webpack",

      {
        //       // outputPattern: {
        //       //   js: "[name].js",
        //       //   css: "index.css",
        //       // },
        extendConfig: (config) => {
          // config.output = {
          //   filename: "bundle.js",
          //   path: path.resolve(__dirname, "./docs/build"),
          //   library: "dataviz",
          // };

          let babel_rule = {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                babelrc: false,
                configFile: path.resolve(__dirname, "babel.config.js"),
                compact: false,
                cacheDirectory: true,
                sourceMaps: false,
              },
            },
          };
          // {
          //   loader: path.resolve(
          //     __dirname,
          //     "./node_modules/@snowpack/plugin-webpack/plugins/import-meta-fix.js"
          //   ),
          // },
          // ],
          // };

          // config.module.rules.push(babel_rule);
          return config;
        },
      },
    ],
  ],
  packageOptions: {
    // source: "remote"
  },
  devOptions: {
    port: 8090,
  },
  buildOptions: {
    // watch: true,
  },
};
