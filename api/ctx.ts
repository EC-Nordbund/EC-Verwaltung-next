import { handleMysql } from "./mysql.ts";
import { RouterContext, helpers } from "oak";

import { docxWorker, tnFileWorker, zuschuesseWorker } from "./worker.ts";

import * as gotenberg from "gotenberg";

const map = new WeakMap<RouterContext<any>, (() => void | Promise<void>)[]>();

let currentContext: ReturnType<typeof createContext> | null;

function createContext(ctx: RouterContext<any>) {
  const [query, mysql_release] = handleMysql();

  map.set(ctx, [mysql_release]);

  const ecCtx = {
    query,
    gotenberg,
    worker: {
      docx: docxWorker,
      tnFile: tnFileWorker,
      zuschuesse: zuschuesseWorker,
    },
  };

  currentContext = ecCtx;

  return ecCtx;
}

function resetContext() {
  currentContext = null;
}

export function getContext() {
  if (!currentContext) throw "Call getContext BEFORE the first await!";
  return currentContext;
}

function releaseContext(ctx: RouterContext<any>) {
  if (map.has(ctx)) {
    map.get(ctx)!.forEach((cb) => cb());
  }
}

export function wrapper(
  cb: (args: { params: any; query: any; body: any }) => Promise<any>
) {
  return async (ctx: RouterContext<any>) => {
    createContext(ctx);
    const pData = cb({
      params: ctx.params,
      query: helpers.getQuery(ctx),
      body: await ctx.request.body({ type: "json" }).value.catch((v) => ({})),
    });
    resetContext();

    const data = await pData;

    ctx.response.headers.set("content-type", "application/json");
    ctx.response.status = 200;
    ctx.response.body = JSON.stringify(data);

    releaseContext(ctx);
  };
}
