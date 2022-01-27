import { wrapper } from "./ctx.ts";
import { Router } from "oak";
import route_0 from "./routes/a.get.ts";
import route_1 from "./routes/test.post.ts";
export default (router: Router) => {
  router.get("/a", wrapper(route_0));
  router.post("/test", wrapper(route_1));
};

