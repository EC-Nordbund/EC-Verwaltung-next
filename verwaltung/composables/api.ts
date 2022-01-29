import { onScopeDispose, watch } from "vue";
import { useStorage } from "@vueuse/core";

export const authToken = useStorage("authToken", "");

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

  if (!authToken.value) return;

  const source = new EventSource(
    new URL("/_sse?authToken=" + authToken.value, __API_BASE_URL__)
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

/**
 * Wird benutzt um die Authdaten in die API calls zu injecten
 * 
 * @internal
 */
export function wrapFetchOptions(opts: RequestInit): RequestInit {
  if (!opts.headers) opts.headers = {};

  // Add auth header
  if (authToken.value) {
    (opts.headers! as Record<string, string>).authorization = authToken.value;
  }

  return opts;
}

// Wenn der authToken sich ändert muss eine neue Eventsource erzeugt werdern
watch(authToken, createNewEventSource, { immediate: !!authToken.value });
