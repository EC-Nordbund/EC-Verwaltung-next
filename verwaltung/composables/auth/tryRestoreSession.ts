import { watch } from 'vue';
import { useAuthData } from './authData';
import { createNewEventSource } from './sse';

const { tokenList, currentToken, authToken } = useAuthData();

// Wenn das sich ändert sichern + neue eventsource (die lebt max 1 Stunde)
watch([tokenList, currentToken], () => {
  localStorage.setItem(
    '@auth',
    JSON.stringify({
      tokens: tokenList.value,
      current: currentToken.value
    })
  );
});
// Wenn in anderem Tab status wechselt
window.addEventListener('storage', ev => {
  if (ev.key === '@auth') {
    tryRestoreSession();
  }
});
/**
 * Versucht eine vorhandene Session in localstorage wiederherzustellen
 */
export function tryRestoreSession() {
  const data = localStorage.getItem('@auth');

  if (!data) return;

  const parsed = JSON.parse(data);

  if ('tokens' in parsed && 'current' in parsed) {
    tokenList.value = parsed.tokens;
    currentToken.value = parsed.current;
  }
}
// Wenn der authToken sich ändert muss eine neue Eventsource erzeugt werdern
watch(authToken, createNewEventSource, { immediate: !!authToken.value });

// Versuche bei startup session wiederherzustellen
tryRestoreSession();
