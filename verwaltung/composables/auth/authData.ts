import { ref, computed, watch } from 'vue';

import { useNow } from '@vueuse/core';
const now = useNow({ interval: 5000 });

/**
 * Aktuell gewähltes AuthToken
 */
const authToken = computed(() =>
  tokenList.value && currentToken.value && tokenList.value[currentToken.value]
    ? tokenList.value[currentToken.value]
    : null
);
/**
 * Aktuelle Nutzerdaten (mit simplen JWT-DATA parser)
 */
const userData = computed(() => (data.value ? data.value.user : null));
const data = computed(() =>
  authToken.value ? JSON.parse(atob(authToken.value.split('.')[1])) : null
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
  return {
    userData,
    status,
    tokenList,
    authToken,
    currentToken,
    internal: data,
    timeUntilExpire
  };
}
const exp = computed(() => (data.value ? data.value.exp * 1000 : null));
const timeUntilExpire = computed(() =>
  exp.value ? exp.value - now.value.getTime() : -42
);

watch(timeUntilExpire, () => {
  if (
    typeof timeUntilExpire.value === 'number' &&
    timeUntilExpire.value < 0 &&
    currentToken.value
  ) {
    tokenList.value = null;
    currentToken.value = null;
  }
});
