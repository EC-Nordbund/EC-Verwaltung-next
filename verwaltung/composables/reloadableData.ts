import { ref, onMounted, Ref, watchEffect } from 'vue';

export function useDataReload<T>(cb: () => Promise<T>, init?: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Ref<T> = ref<T>() as any;
  const loading = ref(true);
  const error = ref<null | Error>(null);

  if (init) data.value = init;

  async function reload(): Promise<T> {
    try {
      const val = await cb();
      data.value = val;
      error.value = null;
      loading.value = false;
      return val;
    } catch (ex) {
      loading.value = false;
      error.value = ex as Error;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return null as any;
    }
  }

  onMounted(() => watchEffect(() => reload()));

  return {
    data,
    reload,
    loading,
    error,
    nav: () => {
      reload();
      return true;
    }
  };
}
