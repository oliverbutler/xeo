const { join } = require('path');

const {
  createGlobPatternsForDependencies,
} = require('@nrwl/workspace/src/utilities/generate-globs');

/**
 * Generates a set of glob patterns based off the source root of the app and its dependencies
 * @param dirPath workspace relative directory path that will be used to infer the parent project and dependencies
 * @param fileGlobPattern pass a custom glob pattern to be used
 */
function createGlobPatternsForDependenciesLocal(
  dirPath,
  fileGlobPattern = '/**/*.{ts,tsx}'
) {
  try {
    return createGlobPatternsForDependencies(dirPath, fileGlobPattern);
  } catch {
    console.warn(
      '\n[createGlobPatternsForDependencies] WARNING: There was no ProjectGraph available to read from, returning an empty array of glob patterns\n'
    );
    return [];
  }
}

module.exports = {
  presets: [require('../../tailwind-workspace-preset.js')],
  content: [
    join(__dirname, './pages/**/*.{ts,tsx}'),
    join(__dirname, './components/**/*.{ts,tsx}'),
    ...createGlobPatternsForDependenciesLocal(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
