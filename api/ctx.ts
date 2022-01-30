import { handleMysql } from "./mysql.ts";
import { RouterContext, helpers } from "oak";
import {
  docxWorker,
  tnFileWorker,
  zuschuesseWorker,
  mailWorker,
} from "./worker.ts";
import * as gotenberg from "gotenberg";
import { checkAuth, check, RechtTyp } from "./authTokens.ts";
import { login } from "./auth.ts";

const mailer = mailWorker();

const map = new WeakMap<RouterContext<any>, (() => void | Promise<void>)[]>();

let currentContext: Awaited<ReturnType<typeof createContext>> | null;

async function handleAuth(ctx: RouterContext<any>) {
  const authToken = ctx.request.headers.get("authentication");

  if (!authToken) return { user: null, checkAuth: () => false };

  const userData = await check(authToken);

  return {
    user: userData,
    checkAuth: (r: Partial<Record<RechtTyp, number | number[]>> = {}) => {
      return checkAuth(userData.rechte, r);
    },
  };
}

async function createContext(ctx: RouterContext<any>) {
  const [query, mysql_release] = handleMysql();
  const { user, checkAuth } = await handleAuth(ctx);

  map.set(ctx, [mysql_release]);

  const ecCtx = {
    query,
    gotenberg,
    user,
    checkAuth,
    mailer,
    login,
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
    await createContext(ctx);
    const pData = cb({
      params: ctx.params,
      query: helpers.getQuery(ctx),
      body: await ctx.request.body({ type: "json" }).value.catch((v) => ({})),
    });
    resetContext();

    try {
      const data = await pData;
      ctx.response.headers.set("content-type", "application/json");
      ctx.response.status = 200;
      ctx.response.body = JSON.stringify(data);
    } catch (ex: any) {
      ctx.response.status = 500;
      ctx.response.body = (ex as Error).message;
    }

    releaseContext(ctx);
  };
}
