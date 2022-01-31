// import * as fs from "fs";
// import * as path from "path";

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = Deno.readDirSync(dirPath);

  for (const file of files) {
    if (file.isDirectory) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file.name, arrayOfFiles);
    } else {
      arrayOfFiles.push(dirPath + "/" + file.name);
    }
  }

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

  const fullPath =
    "/" +
    p
      .split("/")
      .map((v) => (v[0] !== "_" ? v : ":" + v.slice(1)))
      .join("/"); //.slice('/api'.length);

  imports += `import route_${i} from './routes/${file}'\n`;

  calls += `  // @ts-ignore typesmissmach is ok\n  router.${method}(${JSON.stringify(
    fullPath
  )},  wrapper(route_${i}))\n`;
});

code += imports;
code += `export default (router: Router) => {\n${calls}};\n`;

Deno.writeTextFileSync("./.routes.ts", code);
