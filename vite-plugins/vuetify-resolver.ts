import { ComponentResolverObject } from 'unplugin-vue-components';

import { components, directives } from 'vuetify/dist/json/importMap.json';

export function vuetifyResolver(): ComponentResolverObject[] {
  return [
    {
      type: 'directive',
      resolve(name) {
        if (directives.includes(name)) {
          return {
            importName: 'default',
            path: 'vuetify/lib/directives/' + name + '/index.mjs'
          };
        }
      }
    },
    {
      type: 'component',
      resolve(name) {
        if (components[name]) {
          return {
            importName: name,
            path: 'vuetify/lib/' + components[name].from
          };
        }
      }
    }
  ];
}
