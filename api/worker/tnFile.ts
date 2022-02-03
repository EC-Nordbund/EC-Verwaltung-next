import fillFile, { primitiveObject } from 'xlsx';
import { expose } from 'comlink';

interface DATA {
  fields: {
    title: string;
    content: string;
  }[];
  data: primitiveObject[];
}

export const api = {
  generate: (data: DATA) => {
    const file = Deno.readFileSync('./tnListe.xlsx');
    const prepared = fillFile(file, 1, {
      fields: data.fields.map((v) => ({
        title: v.title,
        content: `\${table:anmeldung.${v.content}}`,
      })),
    });

    return fillFile(prepared, 1, { anmeldungen: data.data });
  },
};

expose(api);
