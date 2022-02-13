import { ref, computed, watch } from 'vue';

import { useNow } from '@vueuse/core';

const now = useNow({ interval: 5000 });
const tokenList = ref<null | Record<string, string>>(null);
const currentToken = ref<null | string>(null);

const status = computed(() =>
  tokenList.value ? (currentToken.value ? 2 : 1) : 0
);

const jwtParser = (t: string | null) => t && JSON.parse(atob(t.split('.')[1]));
const authToken = computed(
  () => (status.value === 2 && tokenList.value![currentToken.value!]) || null
);

const data = computed(() => jwtParser(authToken.value) || null);
const userData = computed(() => (data.value ? data.value.user : null));
const exp = computed(() => (data.value ? data.value.exp * 1000 : null));
const timeUntilExpire = computed(() => (exp.value || 0) - now.value.getTime());

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
