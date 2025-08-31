const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  // For remotes (please adjust):
  output: {
    uniqueName: "exercisesRemote",
    publicPath: "auto"
  },
  exposes: {
    './Component': './projects/exercises-feature/src/lib/exercises-feature.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});