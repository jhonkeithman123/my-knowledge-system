// apps/mobile/metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add support for workspace packages
config.watchFolders = [
  __dirname,
  require("path").resolve(__dirname, "../../packages"),
];

// Resolve React Native extensions
config.resolver.sourceExts.push("ts", "tsx");

// Platform-specific extensions (mobile files take priority)
config.resolver.resolverMainFields = ["react-native", "browser", "main"];

module.exports = config;
