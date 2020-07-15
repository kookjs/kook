### How to compile Separate Packages or Module to publish them to the NPM Repo


### How to use ts-node for development purpose in the current framework to run the ./quickstart
Open the terminal and cd the root dir and run the below command
```
  yarn install
  yarn start
```

### How to create a full Project Build of quickstart so we can use packages and modules from the development directory not from the NPM Repo and resolve the Module Names
Open the terminal and cd the root dir and run the below command
```
  gulp clean:packages
  gulp build
  node -r ./tsconfig-paths-bootstrap.js ./dist/quickstart/index.js
```
### How to debug the Packages and Modules source code `.ts` files instead of `.js` files if we are using the packages and modules build directly from NPM repo in a Project
We can use `npm link` in Package or Module directory and then use that in the Project by using commadn `npm link @kookjs/pkg`


### How to create a new Project outside of the development directory

Method 1
```
// Define paths in tsconfig.json so IDE detect the modules
"paths": {
  "@kookjs/*": ["../kook_server/packages/*"],
  "@khanakiajs/*": ["../kook_server/modules/*"]
}

// In order to resolve the module at runtime while usign `ts-node index.ts` you will need module-alias node module
// Add this to the package.json
"_moduleAliases": {
  "@kookjs": "../kook_server/packages/",
  "@khanakiajs": "../kook_server/modules/"
}

and then in your index.ts add the this line to the top of the file
import 'module-alias/register';
```
Note: Method 1 will compile all the packages and modules also together in the dist directory

Method 2 - Prevent Packages and Module compiling
For that you will have to create symlink and remove the above paths and _moduleAliases code so here's symlink creation code
```
const path = require('path');
const fs = require('fs');

function createSymLink(source, dest) {
  console.log(dest)
  console.log(source)
  fs.symlink(
    source,
    dest,
   function (err) { console.log(err || "Done."); }
  );
}

const source = path.resolve(__dirname + "/../kook_server/packages")
const dest = path.resolve(__dirname + "/node_modules/@kookjs")
const sourceModule = path.resolve(__dirname + "/../kook_server/modules")
const destModule = path.resolve(__dirname + "/node_modules/@khanakiajs")

createSymLink(source, dest);
createSymLink(sourceModule, destModule);
```

NOTE: If you will have "paths" defined in tsconfig.json then tsc will also compiles the paths in order to compile the project only not the packages and modules you need to remove the paths and create directory symlink under node_modules for those packages and modules.


### Hot Reloading of the Project