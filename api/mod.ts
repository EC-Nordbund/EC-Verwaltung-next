import { Application, Router } from "oak";
import { oakCors } from "cors";
import "env";
import { setupSSE } from "./sse.ts";
import fillRouter from "./.routes.ts";

const app = new Application();

app.use(
  oakCors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8000",
      "http://localhost:8080",
      "https://verwaltung.ec-nordbund.de",
      "https://test.verwaltung.ec-nordbund.de",
      "https://ec-nordbund.de",
      "https://www.ec-nordbund.de",
    ],
  })
);

const baseRouter = new Router();

baseRouter.get("/", (ctx) => {
  ctx.response.body = "Hello World!";
});

setupSSE(baseRouter);
fillRouter(baseRouter);

app.use(baseRouter.routes());
app.use(baseRouter.allowedMethods());

app.listen({ port: 8080 });

console.log("Server running in Port 8080!");
