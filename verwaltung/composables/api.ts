import { onScopeDispose, watch } from "vue";
import { useStorage } from "@vueuse/core";

export const authToken = useStorage("authToken", "");

const invalidationCb: Record<string, (() => void)[]> = {};

export const baseURL = "http://localhost:8080";

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

export function createNewEventSource() {
  if (currentSource) {
    currentSource.close();
    // Allow GC to collect EventSource
    currentSource = null;
  }

  if (!authToken.value) return;

  const source = new EventSource(
    new URL("/_sse?authToken=" + authToken.value, baseURL)
  );

  source.addEventListener("message", (event) => {
    if (event.data.type === "invalidate") {
      if (invalidationCb[event.data.key]) {
        invalidationCb[event.data.key].forEach((cb) => cb());
      }
    }
  });

  currentSource = source;
}

export function wrapFetchOptions(opts: RequestInit): RequestInit {
  if (!opts.headers) opts.headers = {};

  if (authToken.value) {
    (opts.headers! as Record<string, string>).authorization = authToken.value;
  }

  return opts;
}

watch(authToken, createNewEventSource, { immediate: !!authToken.value });
