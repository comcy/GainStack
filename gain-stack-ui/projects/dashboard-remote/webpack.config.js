const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  // For remotes (please adjust):
  output: {
    uniqueName: "dashboardRemote",
    publicPath: "auto"
  },
  exposes: {
    './Component': './projects/dashboard-feature/src/lib/dashboard-feature.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});