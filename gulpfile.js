var gulp = require("gulp");
var ts = require("gulp-typescript");
var glob = require('glob');
var fs = require('fs');
var path = require('path');
var del = require('del');
const { basename } = require("path");
var merge = require('merge2');  // Requires separate installation

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
  var tsProject = ts.createProject("tsconfig.base.json");
  // const compiled = tsProject
  //   .src()
  //   .pipe(tsProject())
  //   .js.pipe(gulp.dest("dist"));
    await new Promise((resolve, reject) => {
      tsProject
        .src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('./dist'))
        .on("end", resolve)
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

async function deleteDirectory(path) {
  if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
    console.log(path)
    await del(path);
  }
}

function getPackages() {
  let list = []
  glob.sync(__dirname+'/packages/*').forEach( async function(filePath) {
    list.push({
      path: filePath,
      name: basename(filePath)
    })
  });
  return list
}