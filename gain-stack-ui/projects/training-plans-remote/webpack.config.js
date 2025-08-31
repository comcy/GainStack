const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  // For remotes (please adjust):
  output: {
    uniqueName: "trainingPlansRemote",
    publicPath: "auto"
  },
  exposes: {
    './Component': './projects/training-plans-feature/src/lib/training-plans-feature.module.ts',
    './TrainingPlanDetailModule': './projects/training-plans-feature/src/lib/training-plan-detail/training-plan-detail.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});