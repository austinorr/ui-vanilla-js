// tailwind.config.js
// const env = require("dotenv").config();

module.exports = {
  // purge: {
  //   enabled: true,
  //   mode: "all",
  //   content: ["**/src/**/*.{html,js,jsx}"],
  //   // content: ["**/src/**/*.html"],
  // },
  // purge: ["**/src/**/*.{html,js,jsx}"],
  purge: {
    enabled: true,
    layers: ["base", "components", "utilities"],
    content: [
      "**/src/*.{js,html}",
      "**/src/_pg/*.{js,html}",
      "**/src/components/**/*.js",
    ],
  },

  // corePlugins: [],
};
