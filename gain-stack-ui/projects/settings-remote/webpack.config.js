const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  // For remotes (please adjust):
  output: {
    uniqueName: "settingsRemote",
    publicPath: "auto"
  },
  exposes: {
    './Component': './projects/settings-feature/src/lib/settings-feature.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});