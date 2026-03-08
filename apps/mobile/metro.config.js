// apps/mobile/metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const workspaceRoot = path.resolve(__dirname, "../..");
const packagesPath = path.resolve(workspaceRoot, "packages");

// Watch workspace folders
config.watchFolders = [
  workspaceRoot,
  packagesPath,
  path.resolve(packagesPath, "api"),
  path.resolve(packagesPath, "config"),
  path.resolve(packagesPath, "contracts"),
  path.resolve(packagesPath, "db"),
];

// Node module resolution
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Extra node modules to look for
config.resolver.extraNodeModules = {
  "@my-knowledge/api": path.resolve(packagesPath, "api"),
  "@my-knowledge/config": path.resolve(packagesPath, "config"),
  "@my-knowledge/contracts": path.resolve(packagesPath, "contracts"),
  "@my-knowledge/db": path.resolve(packagesPath, "db"),
};

module.exports = config;
