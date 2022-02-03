import type { api as docx_api } from './worker/docx.ts';
import type { api as tn_file_api } from './worker/tnFile.ts';
import type { api as zuschuesse_api } from './worker/zuschuesse.ts';
import type { api as mailer_api } from './worker/mailer.ts';

import { wrap } from 'comlink';

let idCounter = 0;

const workerMap = new Map<number, Worker>();

const registry = new FinalizationRegistry((id: number) => {
  const w = workerMap.get(id);

  if (!w) return;

  w.terminate();
  workerMap.delete(id);
});

export function docxWorker() {
  const worker = new Worker(new URL('./worker/docx.ts', import.meta.url), {
    type: 'module',
    deno: {
      // Dieser darf nicht auf DENO zugreifen damit können wir belibige templates laufen lassen da alles isoliert ist!
      namespace: false,
    },
  });

  idCounter++;
  workerMap.set(idCounter, worker);

  const workerAPI = wrap<typeof docx_api>(worker);

  registry.register(workerAPI, idCounter);

  return workerAPI;
}

export function tnFileWorker() {
  const worker = new Worker(new URL('./worker/tnFile.ts', import.meta.url), {
    type: 'module',
    deno: {
      namespace: true,
    },
  });

  idCounter++;
  workerMap.set(idCounter, worker);

  const workerAPI = wrap<typeof tn_file_api>(worker);

  registry.register(workerAPI, idCounter);

  return workerAPI;
}

export function zuschuesseWorker() {
  const worker = new Worker(
    new URL('./worker/zuschuesse.ts', import.meta.url),
    {
      type: 'module',
      deno: {
        namespace: true,
      },
    },
  );

  idCounter++;
  workerMap.set(idCounter, worker);

  const workerAPI = wrap<typeof zuschuesse_api>(worker);

  registry.register(workerAPI, idCounter);

  return workerAPI;
}

export function mailWorker() {
  const worker = new Worker(new URL('./worker/mailer.ts', import.meta.url), {
    type: 'module',
    deno: {
      namespace: true,
    },
  });

  idCounter++;
  workerMap.set(idCounter, worker);

  const workerAPI = wrap<typeof mailer_api>(worker);

  registry.register(workerAPI, idCounter);

  return workerAPI;
}
