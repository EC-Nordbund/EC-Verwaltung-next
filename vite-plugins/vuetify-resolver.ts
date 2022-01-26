import { ComponentResolverObject } from "unplugin-vue-components";

import { components } from "vuetify/dist/json/importMap.json";

export function vuetifyResolver(): ComponentResolverObject {
  return {
    type: "component",
    resolve(name) {
      if (components[name]) {
        return {
          importName: name,
          path: "vuetify/lib/" + components[name].from,
        };
      }
    },
  };
}
