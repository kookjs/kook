var gulp = require("gulp");
var ts = require("gulp-typescript");
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var del = require('del');
const { basename } = require("path");
var merge = require('merge2');  // Requires separate installation
const child_process = require('child_process');
// gulp.task("default", function() {
//   return tsProject
//     .src()
//     .pipe(tsProject())
//     .js.pipe(gulp.dest("dist"));
// });

gulp.task("build:modules", async function() {
  // glob.sync(__dirname+'/modules/*').forEach( async function(filePath) {
  //   console.log(filePath)
  //   const moduleName = (basename(filePath))
  //   let project = ts.createProject(`${filePath}/tsconfig.json`);
  //   return project
  //     .src()
  //     .pipe(project())
  //     .js.pipe(gulp.dest(`dist/${moduleName}`));
  // });
  
  let modules = [
    {
      path: '/Volumes/D/www/js/kookjs/kook_server/modules/cache',
      name: 'cache'
    }
  ]
  // glob.sync(__dirname+'/modules/*').forEach( async function(filePath) {
  //   // console.log(filePath)
  //   modules.push({
  //     path: filePath,
  //     name: basename(filePath)
  //   })
  // });

  const distDirecotry = __dirname+'/dist';
  for (const module of modules) {
    // console.log(module)
    console.log(`Building module ${module.name}`)

    const distModulePath = distDirecotry + '/' + module.name
    if (fs.existsSync(distModulePath) && fs.statSync(distModulePath).isDirectory()) {
      // console.log(distModulePath)
      await del(distModulePath);
    }

    let project = ts.createProject(`${module.path}/tsconfig.json`);
    console.log(project.config)
    await new Promise((resolve, reject) => {
      var tsResult = project
        .src()
        .pipe(project())
        // .js.pipe(gulp.dest(distModulePath))
        // // .pipe(print((filePath) => `File: ${filePath}`))
        // .on("end", resolve);

        merge([
          tsResult.dts.pipe(gulp.dest(distModulePath)),
          tsResult.js.pipe(gulp.dest(distModulePath)),
          tsResult.on("end", resolve)
        ])
    });

    await new Promise((resolve, reject) => {
      gulp.src([
          `${module.path}/**/*`, //Include All files
          `!${module.path}/**/*.ts`, //It will exclude typescript files 
          `!${module.path}/node_modules/**`
        ])
        .pipe(gulp.dest(distModulePath))
        .on("end", resolve);
    });
    
  }
  // return Promise.resolve('the value is ignored');
});

/**
 * Create a complete project build in ./dist directory
 * After that you can run the project using command
 * node -r ./tsconfig-paths-bootstrap.js ./dist/quickstart/index.js
 */
async function build() {
  await del(['./dist/**'])

  var tsProject = ts.createProject("tsconfig.json", {
    declaration: true
  });
  // const compiled = tsProject
  //   .src()
  //   .pipe(tsProject())
  //   .js.pipe(gulp.dest("dist"));
    await new Promise((resolve, reject) => {
      var tsResult = tsProject
        .src()
        .pipe(tsProject())

        merge([
          tsResult.dts.pipe(gulp.dest('./dist')),
          tsResult.js.pipe(gulp.dest('./dist')),
          tsResult.on("end", resolve)
        ])

    });

    await new Promise((resolve, reject) => {
      gulp.src([
        'quickstart/**/*',
        '!quickstart/**/*.ts',
      ])
      .pipe(gulp.dest('./dist/quickstart'))
      .on("end", resolve);
    });

    await new Promise((resolve, reject) => {
      gulp.src([
        'packages/**/*',
        '!packages/**/*.ts',
      ])
      .pipe(gulp.dest('./dist/packages'))
      .on("end", resolve);
    });

    await new Promise((resolve, reject) => {
      gulp.src([
        'modules/**/*',
        '!modules/**/*.ts',
      ])
      .pipe(gulp.dest('./dist/modules'))
      .on("end", resolve);
    });
}
gulp.task("build", build);

/**
 * Remove node_modules and dist directory from all the packages
 */
gulp.task("clean:packages", async () => {
  for (const package of getPackages()) {
    const nmPath = package.path+'/node_modules';
    const distPath = package.path+'/dist';
    await del([nmPath, distPath])
  }
});

/**
 * It will print the yarn link .. command e.g. 
 * yarn link @khanakiajs/cache @khanakiajs/cache-rdbms @khanakiajs/dot-object @khanakiajs/hook @khanakiajs/util
 */
gulp.task("link:module:command", linkModuleCommand);
async function linkModuleCommand() {
  let command = 'yarn link';
  for (const module of getModules()) {
    try {
      const pkgJsonPath = module.path+'/package.json'
      let rawdata = fs.readFileSync(pkgJsonPath);
      let pkg = JSON.parse(rawdata);
      command += ' ' + pkg.name
    } catch (error) {
      
    }
  }
  console.log(command)
}

gulp.task("link:package:command", linkPackageCommand);
async function linkPackageCommand() {
  let command = 'yarn link';
  for (const module of getPackages()) {
    try {
      const pkgJsonPath = module.path+'/package.json'
      let rawdata = fs.readFileSync(pkgJsonPath);
      let pkg = JSON.parse(rawdata);
      command += ' ' + pkg.name
    } catch (error) {
      
    }
  }
  console.log(command)
}

gulp.task("link:modules", linkModules);
async function linkModules() {
  for (const package of getModules()) {
    const out = await execShellCommand('yarn link', {
      cwd: package.path
    })
    console.log(out)
  }
}

gulp.task("unlink:modules", unLinkModules);
async function unLinkModules() {
  for (const package of getModules()) {
    const out = await execShellCommand('yarn unlink', {
      cwd: package.path
    })
    console.log(out)
  }
}

// NODE_ENV=production gulp link:packages
gulp.task("link:packages", linkPackages);
async function linkPackages() {
  for (const package of getPackages()) {
    console.log(`Linking Package: ${package.name}`)
    const out = await execShellCommand('yarn link', {
      cwd: package.path
    })
    console.log(out)
  }
}

gulp.task("unlink:packages", unLinkPackages);
async function unLinkPackages() {
  for (const package of getPackages()) {
    const out = await execShellCommand('yarn unlink', {
      cwd: package.path
    })
    console.log(out)
  }
}

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd, options) {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(cmd, options, (error, stdout, stderr) => {
    if (error) {
     console.warn(error);
    }

    if (stderr) {
      console.warn(stderr);
     }
    resolve(stdout? stdout : stderr);
   });
  });
 }

async function deleteDirectory(path) {
  if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
    console.log(path)
    await del(path);
  }
}

function getPackages() {
  let dir = __dirname+'/packages/*'
  if(isProd()) {
    dir = __dirname+'/dist/packages/*'
  }
  let list = []
  glob.sync(dir).forEach( async function(filePath) {
    list.push({
      path: filePath,
      name: basename(filePath)
    })
  });
  return list
}

function getModules() {
  let dir = __dirname+'/modules/*'
  if(isProd()) {
    dir = __dirname+'/dist/modules/*'
  }

  let list = []
  glob.sync(dir).forEach( async function(filePath) {
    list.push({
      path: filePath,
      name: basename(filePath)
    })
  });
  return list
}

function isProd() {
  return process.env.NODE_ENV=='production'
}