const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);
config.watchFolders = [path.join(root, 'packages/core'), path.join(root, 'data')];
module.exports = config;
