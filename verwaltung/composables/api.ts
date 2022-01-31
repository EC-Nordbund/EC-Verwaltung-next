import { watch, ref, computed } from "vue";
// import { useStorage } from "@vueuse/core";
import apiLogin from "@api/auth/login.post";
import { createNewEventSource } from "./sse";
export { onInvalidate } from "./sse";

/**
 * Aktuell gewähltes AuthToken
 */
export const authToken = computed(() =>
  tokenList.value && currentToken.value && tokenList.value[currentToken.value]
    ? tokenList.value[currentToken.value]
    : null
);

/**
 * Aktuelle Nutzerdaten (mit simplen JWT-DATA parser)
 */
const userData = computed(() =>
  authToken.value ? JSON.parse(atob(authToken.value.split(".")[1])).user : null
);
/**
 * Liste der Tokens die ein Nutzer hat
 */
const tokenList = ref<null | Record<string, string>>(null);
/**
 * Name des aktuellen Tokens
 */
const currentToken = ref<null | string>(null);

/**
 * Akteller Login Status 0 = LogedOut; 1 = LogedIn aber es muss gewählt werden als was man sich einloggt; 2 = logedIn
 */
const status = computed(() => {
  if (!tokenList.value) {
    return 0;
  }

  if (!currentToken.value) {
    return 1;
  }

  return 2;
});

/**
 * Auth Daten benutzen
 *
 * @returns Alles relevante zur authentifizierung
 */
export function useAuthData() {
  return { userData, status, tokenList, currentToken };
}

// Wenn das sich ändert sichern + neue eventsource (die lebt max 1 Stunde)
watch([tokenList, currentToken], () => {
  localStorage.setItem(
    "@auth",
    JSON.stringify({
      tokens: tokenList.value,
      current: currentToken.value,
    })
  );
});

// Wenn in anderem Tab status wechselt
window.addEventListener("storage", (ev) => {
  if (ev.key === "@auth") {
    tryRestoreSession();
  }
});

/**
 * Versucht eine vorhandene Session in localstorage wiederherzustellen
 */
function tryRestoreSession() {
  const data = localStorage.getItem("@auth");

  if (!data) return;

  const parsed = JSON.parse(data);

  if ("tokens" in parsed && "current" in parsed) {
    tokenList.value = parsed.tokens;
    currentToken.value = parsed.current;
  }
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

/**
 * Login
 */
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

// Versuche bei startup session wiederherzustellen
tryRestoreSession();
