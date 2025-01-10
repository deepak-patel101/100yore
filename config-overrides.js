const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = function override(config, env) {
  if (env === "production") {
    config.plugins.push(new BundleAnalyzerPlugin());

    config.optimization = {
      ...config.optimization,
      splitChunks: {
        ...config.optimization.splitChunks,
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Ensure module.context is not null
              if (module.context) {
                const match = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                );
                if (match) {
                  const packageName = match[1];
                  return `npm.${packageName.replace("@", "")}`;
                }
              }
              return null;
            },
          },
        },
      },
    };

    config.performance = {
      ...config.performance,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    };
  }
  return config;
};
