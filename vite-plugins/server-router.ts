import { Plugin } from "vite";

export default () => {
  return {
    name: "server-router",
    resolveId(id) {
      if (!id.startsWith("@api")) return;

      return id;
    },
    load(id) {
      if (!id.startsWith("@api")) return;

      const path = id.slice(4);
      // console.log(path);

      const [p, METHOD] = path.split(".");
      const partedPath = p.split(/\\|\//);

      const pathLit = partedPath
        .map((part) => (part[0] === "_" ? "params." + part.slice(1) : part))
        .join("/");

      const code = `
        import { wrapFetchOptions } from '@/composables/api'

        export default async ({ params, query, body }) => {
          const url = new URL(\`${pathLit}\`, __API_BASE_URL__)

          if(query) {}
            const s = new URLSearchParams(query)
            url.search = s.toString()
          }

          const res = await fetch(url.href, wrapFetchOptions({
            method: '${METHOD}',
            headers: {
              'content-type': 'application/json'
            },
            body: JSON.stringify(body)
          }))

          if(res.status !== 200) throw new Error(await res.text())

          return res.json()
        }
      `;

      console.log(code);

      return code;
    },
  } as Plugin;
};
