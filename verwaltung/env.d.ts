/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// global {
  declare const __API_BASE_URL__: string;

  declare const __BUILD_ID__: string;
// }