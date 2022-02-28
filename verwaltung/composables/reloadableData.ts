import {
  ref,
  Ref,
  shallowRef,
  shallowReadonly,
  DeepReadonly,
  watch,
  isRef,
  ShallowRef,
  onScopeDispose
} from 'vue';
import { onInvalidate } from '@/composables/auth';

export function useDataReload<T, O>(
  cb: (options: O) => Promise<T>,
  args: Ref<O> | null,
  {
    init,
    watchArgs = true,
    invalidations = []
  }: {
    init?: T;
    watchArgs?: boolean;
    invalidations?: Ref<Array<string>> | Array<string>;
  } = {}
) {
  // Init Refs
  const loading = ref(true);
  const data = shallowRef<T>() as unknown as ShallowRef<T>;
  const error = shallowRef<null | Error>(null);

  if (init) data.value = init;

  let fetchAbort: AbortController;

  async function reload() {
    if (fetchAbort) fetchAbort.abort();

    fetchAbort = new AbortController();

    // Stop fetch on unmounted etc.
    onScopeDispose(() => fetchAbort.abort());

    try {
      // any wird hier benötigt da signal eigentlich typenmäßig nicht existiert aber praktisch doch.
      const val = await cb({
        signal: fetchAbort.signal,
        ...(args?.value ?? {})
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      data.value = val;
      error.value = null;
      loading.value = false;
    } catch (ex) {
      loading.value = false;
      error.value = ex as Error;
    }
  }

  // Watch argument change?
  if (watchArgs && args) watch(args, reload);

  if (isRef(invalidations)) {
    // watch invalidations
    let invalidateAbort = new AbortController();

    onInvalidate(invalidations.value, reload, invalidateAbort.signal);

    onScopeDispose(() => invalidateAbort.abort());

    watch(invalidations, () => {
      invalidateAbort.abort();
      invalidateAbort = new AbortController();
      onInvalidate(invalidations.value, reload, invalidateAbort.signal);
    });
  } else {
    // Static invalidations
    onInvalidate(invalidations, reload);
  }

  // Load data!
  reload();

  return {
    // Typenmäßig machen wir den return nur readable um bugs zu vermeiden. Wir machen daher auch nur ein shallow da die Datenstrucktur nicht komplett proxifiziert werden muss.
    // Da der .value wert readonly sein sollte nutzen wir shallowReadonly.
    data: shallowReadonly(data as Ref<DeepReadonly<T>>),
    reload,
    loading,
    error
  };
}
