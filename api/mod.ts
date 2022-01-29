import {
  Application,
  Router,
  ServerSentEventTarget,
  helpers,
  ServerSentEvent,
} from "oak";

// console.log(docxWorker());

import fillRouter from "./.routes.ts";

const app = new Application();

const baseRouter = new Router();

const targets: ServerSentEventTarget[] = [];

baseRouter.get("/_sse", (ctx) => {
  const target = ctx.sendEvents();

  const auth = helpers.getQuery(ctx).authToken;

  // TODO: add auth check
  if (false) {
    target.close();
    return;
  }

  targets.push(target);

  let to = setTimeout(() => {
    target.close();
  }, 1000 * 60 * 60); // max 1 Stunde alive!

  target.addEventListener("close", () => {
    clearTimeout(to);
    targets.splice(targets.indexOf(target), 1);
  });
});

baseRouter.get("/", (ctx) => {
  ctx.response.body = "Hello World!";
});

fillRouter(baseRouter);

app.use(baseRouter.routes());
app.use(baseRouter.allowedMethods());

app.listen({ port: 8080 });

console.log("Server running in Port 8080!");

export function sendData(ev: ServerSentEvent) {
  targets.forEach((t) => t.dispatchEvent(ev));
}
