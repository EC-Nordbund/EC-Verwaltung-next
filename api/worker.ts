import type { api } from "./worker/docx.ts";
import { wrap } from "comlink";

let idCounter = 0;

const workerMap = new Map<number, Worker>();

const registry = new FinalizationRegistry((id: number) => {
  const w = workerMap.get(id);

  console.log(id);

  if (!w) return;

  w.terminate();
  workerMap.delete(id);
});

export function docxWorker() {
  const worker = new Worker(new URL("./worker/docx.ts", import.meta.url), {
    type: "module",
  });

  idCounter++;
  workerMap.set(idCounter, worker);

  const workerAPI = wrap<typeof api>(worker);

  registry.register(workerAPI, idCounter);

  return workerAPI;
}
