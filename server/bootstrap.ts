// Bootstrap our app so that we can use @common

// tslint:disable-next-line:no-any we import from json
const tsConfig: any = require('./tsconfig.json');
import * as TsConfigPaths from 'tsconfig-paths';

TsConfigPaths.register({
  baseUrl: __dirname, // Dirname refers to the compiled file dir
  paths: tsConfig.compilerOptions.paths
});
