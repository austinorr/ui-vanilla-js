// const path = require("path");

/**
 * Snowpack plugin that reloads all CSS changes with PostCSS any time any .tsx
 * file changes.
 *
 * This plugin is necessary because adding a React className like bg-blue won't
 * trigger a CSS refresh. As a workaround, pessimistically assume that any time
 * the tsx file changes that the CSS changes to trigger PostCSS.
 *
 * For details, see https://github.com/snowpackjs/snowpack/issues/2916.
 *
 * @param {import('snowpack').SnowpackConfig} snowpackConfig
 * @param {import('snowpack').SnowpackPlugin & { init?: (cfg: import('snowpack').SnowpackConfig) => void }} _pluginOptions
 */
// const plugin = (snowpackConfig, _pluginOptions) => {
//   const appCssPath = path.join(
//     snowpackConfig.root || process.cwd(),
//     "src/css/tw.css"
//   );
//   return {
//     name: "@local/snowpack-css-refresh-plugin",
//     onChange({ filePath }) {
//       if (!filePath.endsWith(".js")) {
//         return;
//       }
//       this.markChanged(appCssPath);
//     },
//   };
// };

// module.exports = plugin;

// const path = require("path");
// const resolveConfig = require("tailwindcss/resolveConfig");
// const micromatch = require("micromatch");

// const tailwindConfig = resolveConfig(
//   require(path.join(process.cwd(), "/tailwind.config.js"))
// );
// const plugin = (snowpackConfig, _pluginOptions) => {
//   const appCssPath = path.join(
//     snowpackConfig.root || process.cwd(),
//     "src/css/tw.css"
//   );
//   return {
//     name: "@local/snowpack-css-refresh-plugin",
//     onChange({ filePath }) {
//       let m =
//         tailwindConfig.purge && tailwindConfig.purge.content
//           ? tailwindConfig.purge.content
//           : tailwindConfig.purge;

//       if (!micromatch.isMatch(filePath, m)) {
//         return;
//       }
//       this.markChanged(appCssPath);
//     },
//   };
// };

// module.exports = plugin;

const fs = require("fs");
const path = require("path");
const micromatch = require("micromatch");
const tailwindConfig = require("tailwindcss/resolveConfig")(
  require(path.join(process.cwd(), "/tailwind.config.js"))
);

const TAILWIND_IMPORT_REGEX = /\@import\s+['"](tailwindcss\/.+)['"].*|\@tailwind\s+.*/g;

module.exports = (snowpackConfig, pluginOptions) => {
  let filesWithTailwindImports = [];
  return {
    name: "@jadex/snowpack-plugin-tailwindcss-jit",
    resolve: {
      input: [".pcss", ".css"],
      output: [".css"],
    },
    onChange({ filePath }) {
      if (
        !micromatch.isMatch(
          filePath,
          tailwindConfig.purge.content ?? tailwindConfig.purge
        )
      ) {
        return;
      }

      console.log("changed:", filePath);

      filesWithTailwindImports.forEach((filePath) =>
        this.markChanged(filePath)
      );
    },
    /** Load files that contain TailwindCSS imports*/
    async load({ filePath, isDev }) {
      if (!isDev || filesWithTailwindImports.includes(filePath)) {
        return;
      }

      const fileContents = fs.readFileSync(filePath, "utf8");
      const regex = new RegExp(TAILWIND_IMPORT_REGEX);

      if (regex.test(fileContents)) {
        filesWithTailwindImports.push(filePath);
      }
    },
  };
};
