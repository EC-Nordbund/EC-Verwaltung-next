import { client } from "./mysql.ts";
import { helpers, RouterContext } from "oak";
import {
  docxWorker,
  mailWorker,
  tnFileWorker,
  zuschuesseWorker,
} from "./worker.ts";
import * as gotenberg from "gotenberg";
import { check, checkAuth, RechtTyp } from "./authTokens.ts";
import { login } from "./auth.ts";

const mailer = mailWorker();

const map = new WeakMap<
  RouterContext<string>,
  (() => void | Promise<void>)[]
>();

let currentContext: Awaited<ReturnType<typeof createContext>> | null;

async function handleAuth(ctx: RouterContext<string>) {
  const authToken = ctx.request.headers.get("authorization");

  if (!authToken) {
    return {
      user: null,
      checkAuth: (
        _r: Partial<Record<RechtTyp | "admin", number | number[]>> = {},
      ) => {
        throw new Error("Du hast nicht die Rechte!");
      },
    };
  }

  const userData = await check(authToken);

  return {
    user: userData,
    checkAuth: (
      r: Partial<Record<RechtTyp | "admin", number | number[]>> = {},
    ) => {
      return checkAuth(userData.rechte, r);
    },
  };
}

async function createContext(ctx: RouterContext<string>) {
  const { user, checkAuth } = await handleAuth(ctx);

  map.set(ctx, []);

  const ecCtx = {
    gotenberg,
    user,
    checkAuth,
    mailer,
    login,
    mysql: client,
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

function releaseContext(ctx: RouterContext<string>) {
  if (map.has(ctx)) {
    map.get(ctx)!.forEach((cb) => cb());
  }
}

export function wrapper(
  cb: (args?: {
    params?: unknown;
    query?: unknown;
    body?: unknown;
  }) => Promise<unknown>,
) {
  return async (ctx: RouterContext<string>) => {
    await createContext(ctx);
    const pData = cb({
      params: ctx.params,
      query: helpers.getQuery(ctx),
      body: await ctx.request.body({ type: "json" }).value.catch(() => ({})),
    });
    resetContext();

    try {
      const data = await pData;
      ctx.response.headers.set("content-type", "application/json");
      ctx.response.status = 200;
      ctx.response.body = JSON.stringify(data);
    } catch (ex: unknown) {
      ctx.response.status = 500;
      ctx.response.body = (ex as Error).message;
    }

    releaseContext(ctx);
  };
}
