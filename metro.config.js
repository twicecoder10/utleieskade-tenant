const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add web support for better error handling
config.resolver.sourceExts.push("web.js", "web.jsx", "web.ts", "web.tsx");

module.exports = withNativeWind(config, { input: "./global.css" });
