import { Application } from "https://deno.land/x/oak/mod.ts";
console.log("Hi from server", Application);

export function getContext() {
  return {
    a: 42,
    b: new Application(),
  };
}
