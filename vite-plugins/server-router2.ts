import { Plugin } from "vite";
import * as fs from "fs";
import * as path from "path";

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

export default ({} = {}) => {
  return {
    name: "server-router",
    resolveId(id) {
      if (id !== "@routes-server") return;

      return id;
    },
    load(id) {
      if (id !== "@routes-server") return;

      let code = `import { wrapper } from '/api/ctx.ts';`;

      const files = getAllFiles("api/routes")
        .map((v) => v.split(/\\|\//).join("/"))
        .map((v) => v.split("/api/routes/")[1]);

      let imports = "";
      let calls = "";

      files.forEach((file, i) => {
        const [p, method] = file.split(".");

        const fullPath = p
          .split("/")
          .map((v) => (v[0] !== "_" ? v : ":" + v.slice(1)))
          .join("/");

        imports += `import route_hanlder_${i} from '/api/routes/${file}'\n`;

        calls += `let route_handler_wraped_${i} = wrapper(route_hanlder_${i})
          router.${method}(${JSON.stringify("/" + fullPath)}, (ctx, next) => {
            return route_handler_wraped_${i}(ctx, next)
          })
        `;
      });

      // console.log(files);
      code += imports;
      code += `export default (router) => {${calls}};`;

      console.log(code);
      return code;
    },
  } as Plugin;
};
