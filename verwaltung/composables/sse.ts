import { onScopeDispose } from "vue";
import { authToken } from "./api";

const invalidationCb: Record<string, (() => void)[]> = {};

export function onInvalidate(key: string[], cb: () => void) {
  if (currentSource?.readyState === 2) {
    createNewEventSource();
  }

  key.forEach((k) => {
    if (invalidationCb[k]) {
      invalidationCb[k].push(cb);
    } else {
      invalidationCb[k] = [cb];
    }
  });

  onScopeDispose(() => {
    key.forEach((k) => {
      invalidationCb[k].splice(invalidationCb[k].indexOf(cb), 1);
    });
  });
}
let currentSource: EventSource | null = null;
/**
 * Sollte normalerweise nur in core-tools benötigt werden
 *
 * @internal
 */

export function createNewEventSource() {
  if (currentSource) {
    currentSource.close();
    // Allow GC to collect EventSource
    currentSource = null;
  }

  if (!authToken.value)
    return;

  const source = new EventSource(
    new URL("/_sse?authToken=" + authToken.value, __API_BASE_URL__)
  );

  source.addEventListener("invalidate", ((event: MessageEvent) => {
    if (invalidationCb[event.data]) {
      invalidationCb[event.data].forEach((cb) => cb());
    }
  }) as any);

  currentSource = source;
}
