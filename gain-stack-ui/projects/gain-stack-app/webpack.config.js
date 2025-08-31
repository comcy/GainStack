const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  remotes: {
    "analyticsRemote": "analyticsRemote@http://localhost:4201/remoteEntry.js",
    "dashboardRemote": "dashboardRemote@http://localhost:4202/remoteEntry.js",
    "exercisesRemote": "exercisesRemote@http://localhost:4203/remoteEntry.js",
    "settingsRemote": "settingsRemote@http://localhost:4204/remoteEntry.js",
    "trainingPlansRemote": "trainingPlansRemote@http://localhost:4205/remoteEntry.js",
    "workoutsRemote": "workoutsRemote@http://localhost:4206/remoteEntry.js",
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});