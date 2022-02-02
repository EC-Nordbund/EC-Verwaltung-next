import fillFile, { data } from 'xlsx';
import { expose } from 'comlink';

export const api = {
  generate: (data: data) => {
    const file = Deno.readFileSync('./zuschuesse.xlsx');
    return fillFile(file, 1, data);
  },
};

expose(api);
