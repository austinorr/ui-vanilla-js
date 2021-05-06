module.exports = function (api) {
  api.cache(true);
  const presets = [
    [
      "@babel/preset-env",
      {
        corejs: "3",
        useBuiltIns: "usage",
        targets: {
          browsers: ["defaults", "not dead", "> 1%"],
        },
      },
    ],
  ];
  const plugins = [["@babel/transform-runtime"]];
  return {
    presets,
    plugins,
  };
};
