import { Plugin } from "vite";

export default ({ baseUrl = "http://localhost:8080" } = {}) => {
  return {
    name: "server-router",
    resolveId(id) {
      if (id === "@headers") return id;
      if (!id.startsWith("@api")) return;

      return id;
    },
    load(id) {
      if (id === "@headers") return `export const headers = v => ({})`;
      if (!id.startsWith("@api")) return;

      const path = id.slice(4);
      // console.log(path);

      const [p, METHOD] = path.split(".");
      const partedPath = p.split(/\\|\//);

      const pathLit = partedPath
        .map((part) => (part[0] === "_" ? "params." + part.slice(1) : part))
        .join("/");

      return `
        import { headers } from '@headers'

        export default ({ params, query, body }) => {
          const url = new URL(\`${pathLit}\`, ${JSON.stringify(baseUrl)})
          const s = new URLSearchParams(query)
          url.search = s.toString()

          return fetch(url.href, {
            method: '${METHOD}',
            headers: {
              'content-type': 'application/json',
              ...headers({
                url
              })
            },
            body: JSON.stringify(body)
          }).then(res => res.json())
        }
      `;
    },
  } as Plugin;
};
