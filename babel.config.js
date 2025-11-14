module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': '.',
            'react-native-gesture-handler/lib/module/PlatformConstants': './lib/patches/RNGHPlatformConstants',
            'react-native-gesture-handler/lib/commonjs/PlatformConstants': './lib/patches/RNGHPlatformConstants',
          }
        }
      ]
    ],
  };
};
