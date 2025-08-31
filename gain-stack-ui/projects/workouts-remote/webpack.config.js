const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  // For remotes (please adjust):
  output: {
    uniqueName: "workoutsRemote",
    publicPath: "auto"
  },
  exposes: {
    './Component': './projects/workouts-feature/src/lib/workouts-feature.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});