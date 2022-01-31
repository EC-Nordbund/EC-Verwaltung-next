import { onScopeDispose, watch, ref, computed } from "vue";
// import { useStorage } from "@vueuse/core";
import apiLogin from "@api/auth/login.post";
import {} from "jose";

const authToken = computed(() =>
  tokenList.value && currentToken.value && tokenList.value[currentToken.value]
    ? tokenList.value[currentToken.value]
    : null
);

const userData = computed(() =>
  authToken.value ? JSON.parse(atob(authToken.value.split(".")[1])).user : null
);
const tokenList = ref<null | Record<string, string>>(null);
const currentToken = ref<null | string>(null);

const status = computed(() => {
  if (!tokenList.value) {
    return 0;
  }

  if (!currentToken.value) {
    return 1;
  }

  return 2;
});

export function useAuthData() {
  return { userData, status, tokenList, currentToken };
}

watch([tokenList, currentToken], () => {
  localStorage.setItem(
    "@auth",
    JSON.stringify({
      tokens: tokenList.value,
      current: currentToken.value,
    })
  );
});

window.addEventListener("storage", (ev) => {
  if (ev.key === "@auth") {
    tryRestoreSession();
  }
});

function tryRestoreSession() {
  const data = localStorage.getItem("@auth");

  if (!data) return;

  const parsed = JSON.parse(data);

  if ("tokens" in parsed && "current" in parsed) {
    tokenList.value = parsed.tokens;
    currentToken.value = parsed.current;
  }
}

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

  source.addEventListener("invalidate", ((event: MessageEvent) => {
    if (invalidationCb[event.data]) {
      invalidationCb[event.data].forEach((cb) => cb());
    }
  }) as any);

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

export async function login(username: string, password: string) {
  const tokens = await apiLogin({
    params: {},
    body: { username, password },
    query: {},
  });

  tokenList.value = tokens;
  if (currentToken.value && !tokenList.value[currentToken.value]) {
    currentToken.value = null;
  }

  if (Object.values(tokens).length === 1) {
    currentToken.value = Object.keys(tokens)[0];
  }

  return true;
}

tryRestoreSession();
