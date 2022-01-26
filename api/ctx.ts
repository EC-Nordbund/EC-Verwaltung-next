import { handleMysql } from "./deps/mysql.ts";
import { RouterContext } from "https://deno.land/x/oak@v10.1.0/mod.ts";

const map = new WeakMap<RouterContext<any>, (() => void | Promise<void>)[]>();

let currentContext: ReturnType<typeof createContext> | null;

export function createContext(ctx: RouterContext<any>) {
  const [query, mysql_release] = handleMysql();

  map.set(ctx, [mysql_release]);

  currentContext = {
    query,
  };

  return {
    query,
  };
}

export function resetContext() {
  currentContext = null;
}

export function getContext() {
  if (!currentContext) throw "Call getContext BEFORE the first await!";
  return currentContext;
}

export function releaseContext(ctx: RouterContext<any>) {
  if (map.has(ctx)) {
    map.get(ctx)!.forEach((cb) => cb());
  }
}
