import * as fs from "fs";
import * as path from "path";

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(path.dirname(import.meta.url), dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles("api/routes")
  .map((v) => v.split(/\\|\//).join("/"))
  .map((v) => v.split("/api/routes/")[1]);

let imports = "";
let calls = "";

let code = `/* GENERATED FILE DO NOT CHANGE OR COMMIT */\nimport { wrapper } from './ctx.ts';\nimport { Router } from 'oak'\n`;

files.forEach((file, i) => {
  const [p, method] = file.split(".");

  const fullPath = '/' + p
    .split("/")
    .map((v) => (v[0] !== "_" ? v : ":" + v.slice(1)))
    .join("/")//.slice('/api'.length);

  imports += `import route_${i} from './routes/${file}'\n`;

  calls += `  router.${method}(${JSON.stringify(
    fullPath
  )},  wrapper(route_${i}))\n`;

});

code += imports;
code += `export default (router: Router) => {\n${calls}};\n`;

fs.writeFileSync('./api/.routes.ts', code)