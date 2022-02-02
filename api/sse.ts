import { Router, ServerSentEvent, ServerSentEventTarget } from 'oak';
import { helpers } from 'oak';
import { check } from './authTokens.ts';

export const targets: ServerSentEventTarget[] = [];
export function setupSSE(router: Router) {
  router.get('/_sse', async (ctx) => {
    const target = ctx.sendEvents();

    const auth = helpers.getQuery(ctx).authToken;

    if (!(await check(auth))) {
      target.close();
      return;
    }

    targets.push(target);

    const to = setTimeout(() => {
      target.close();
    }, 1000 * 60 * 60); // max 1 Stunde alive!

    target.addEventListener('close', () => {
      clearTimeout(to);
      targets.splice(targets.indexOf(target), 1);
    });
  });
}

export function sendData(ev: ServerSentEvent) {
  targets.forEach((t) => t.dispatchEvent(ev));
}

export function invalidate(key: string) {
  sendData(new ServerSentEvent('invalidate', key));
}
