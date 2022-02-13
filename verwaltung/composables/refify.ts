import { Ref, computed, isRef, ComputedRef } from 'vue';

type RefifiedFunction<I, O> = {
  (i: I): O;
  (i: Ref<I>): ComputedRef<O>;
};

export function refify<I, O>(cb: (i: I) => O) {
  return ((a: I | Ref<I>) =>
    isRef(a) ? computed(() => cb(a.value)) : cb(a)) as RefifiedFunction<I, O>;
}
