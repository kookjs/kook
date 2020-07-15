/**
 * Run command to compile the Typescript quickstart `tsc -P tsconfig.base.json` in root directory
 * After that you can use this command to resolve @kookjs/modules
 * node -r ./tsconfig-paths-bootstrap.js ./dist/quickstart/index.js
 */

const stripJsonComments = require('strip-json-comments');
let jsontxt = (require('fs').readFileSync(__dirname + '/tsconfig.base.json', 'utf8'))
jsontxt = stripJsonComments(jsontxt);
// console.log(jsontxt)
var tsConfig = JSON.parse(jsontxt);

const tsConfigPaths = require("tsconfig-paths");
 
// console.log(tsConfig.compilerOptions.paths)
// const baseUrl = "./dist"; // Either absolute or relative path. If relative it's resolved to current working directory.
const baseUrl = tsConfig.compilerOptions.outDir

const cleanup = tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
});
 
// When path registration is no longer needed
// cleanup();