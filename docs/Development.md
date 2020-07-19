## How to compile Separate Packages or Module to publish them to the NPM Repo


## How to use ts-node for development purpose in the current framework to run the ./quickstart
Open the terminal and cd the root dir and run the below command
```
  yarn install
  yarn start
```

## How to create a full Project Build of quickstart so we can use packages and modules from the development directory not from the NPM Repo and resolve the Module Names
Open the terminal and cd the root dir and run the below command
```
  gulp clean:packages
  gulp build
  node -r ./tsconfig-paths-bootstrap.js ./dist/quickstart/index.js
```
Note: comment the `include` and remove other directories from `exclude` in tsconfig.json.

## How to debug the Packages and Modules source code `.ts` files instead of `.js` files if we are using the packages and modules build directly from NPM repo in a Project
We can use `npm link` in Package or Module directory and then use that in the Project by using commadn `npm link @kookjs/pkg`


## How to create a new Project outside of the development directory

### Method 1
This will compile the packages|modules also together no matte what
```
// Define paths in tsconfig.json so IDE detect the modules
"paths": {
  "@kookjs/*": ["../kook_server/packages/*"],
  "@khanakiajs/*": ["../kook_server/modules/*"]
}

// In order to resolve the module at production runtime while using `node dist/index.ts` you will need module-alias node module
Ref: https://dev.to/larswaechter/path-aliases-with-typescript-in-nodejs-4353
// Add this to the package.json
"_moduleAliases": {
  "@kookjs": "dist/packages/",
  "@khanakiajs": "dist/modules/"
}

and then in your index.ts add the this line to the top of the file
import 'module-alias/register';
```
Note: Method 1 will compile all the packages and modules also together in the dist directory

### Method 2 - Prevent Packages and Module compiling
For that you will have to create symlink and remove the above paths and _moduleAliases code so here's symlink creation code

There is one flaw in this method is whenver you will do yarn it will removes the LINK and Original files also and you will have to link again. Be careful and take backup everytime before you do yarn in your Project
```
  const path = require('path');
  const fs = require('fs');
  const { couldStartTrivia } = require('typescript');

  function createSymLink(source, dest) {
    // console.log(dest)
    // console.log(source)
    fs.symlink(
      source,
      dest,
    function (err) { console.log(err || "Done."); }
    );

    fs.del
  }

  console.log(process.env.NODE_ENV)

  function linkDirectories() {
    let source = path.resolve(__dirname + "/../kook_server/packages")
    let sourceModule = path.resolve(__dirname + "/../kook_server/modules")

    if(process.env.NODE_ENV=='production') {
      console.log('Linking Productin Builds')
      source = path.resolve(__dirname + "/../kook_server/dist/packages")
      sourceModule = path.resolve(__dirname + "/../kook_server/dist/modules")
    } else {
      console.log('Linking Development Module')
    }

    const dest = path.resolve(__dirname + "/node_modules/@kookjs")
    const destModule = path.resolve(__dirname + "/node_modules/@khanakiajs")

    try {
      fs.unlinkSync(dest);
      console.log('successfully unliked '+ dest);
    } catch (err) {
      // console.log(err)
    }

    try {
      fs.unlinkSync(destModule);
      console.log('successfully unlinked ' + dest);
    } catch (err) {
      // console.log(err)
    }
    
    createSymLink(source, dest);
    console.log('Created new symlink ' + dest)

    createSymLink(sourceModule, destModule);
    console.log('Created new symlink ' + destModule)
  }


  const readline = require("readline");
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });

  const message = `=========== WARNING DANGEROUS COMMAND ================ \n
  This command can lead to delete your actual directories while creating symlink. \n
  So please first backup your directories. \n`
  console.log(message)

  rl.question("Are you sure have you backuped your directories ? y|n ", function(name) {
      if(name=='y') {
        linkDirectories();
      }
      rl.close();
  });

  rl.on("close", function() {
      console.log("\nBYE BYE !!!");
      process.exit(0);
  });
```

NOTE: If you will have "paths" defined in tsconfig.json then tsc will also compiles the paths in order to compile the project only not the packages and modules you need to remove or comment out the `paths` and create symlinks for each packages|modules directory under project/node_modules first.

### Method 3 - Yarn Link
I have created a gulp script `gulp link:packages` and `gulp link:modules` you can use this create a yarn link in each packages and mdoule.
If you do not want the packages and modules to be compiled together with Project then you need to create a build for pakcages and modules and then do yarn link in Dist Directory so in this way your packages and modules are already compiled and will not compile again alongside with the project.

Add this to the package.json for the Project we need this so yarn can install all the dependencies automatically because `yarn link @pkgname` does not installs the pkg dependencies when you run `yarn install`
```
  "workspaces": [
    "src/packages/*",
    "../kook_server/packages/*",
    "../kook_server/modules/*"
  ]
```

#### Creat Production Links
```
gulp build
gulp unlink:packages
gulp unlink:modules
NODE_ENV=production gulp link:packages
NODE_ENV=production gulp link:modules
// print link commands
gulp link:module:command
gulp link:package:command
```

In your project start command you will have to add `NODE_PATH=./node_modules node dist/index.js` because let say `@kookjs/core` uses `@khanakiajs/hook` so it will not find the hook packages as both are symlinks that's we need to explicitly set the NODE_PATH.

Note: This is the safest method i found till yet.

## Hot Reloading of the Project