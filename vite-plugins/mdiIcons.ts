import * as mdi from "@mdi/js";

const mdi_keys = {};
Object.keys(mdi)
  .filter((v) => v !== "default")
  .sort((a, b) => b.length - a.length)
  .forEach((v) => {
    mdi_keys[v] = mdi[v];

    const alt = v
      .split("")
      .map((v) => (v.toLowerCase() == v ? v : "-" + v.toLowerCase()))
      .join("");

    mdi_keys[alt] = mdi[v];
  });

export function mdiIcons() {
  return {
    name: "mdi-icons",
    transform(code, id) {
      if (!id.includes(".vue")) return;
      Object.entries(mdi_keys).forEach(([key, value]) => {
        code = code.replaceAll(key, value);
      });
      return code;
    },
  };
}
