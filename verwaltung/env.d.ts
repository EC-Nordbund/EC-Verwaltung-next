/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types="vite/client" />
/// <reference types="vite-plugin-pages/client" />

import { RechtTyp } from '@types';

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ctx {
  // mysql: {
  gotenberg: any;
  user: any;
  checkAuth: (r: Partial<Record<RechtTyp, number | number[]>>) => boolean;
  mailer: {
    sendMail: (c: any) => Promise<void>;
  };
  login: (u: string, p: string) => Record<string, string>;
  hash: (d: string) => Promise<string>;
  mysql: {
    query: (sql: string, args: any[]) => Promise<any>;
    useConnection: <t>(
      cb: (con: {
        query: (sql: string, args: any[]) => Promise<any>;
      }) => Promise<T>
    ) => Promise<T>;
    transaction: <t>(
      cb: (con: {
        query: (sql: string, args: any[]) => Promise<any>;
      }) => Promise<T>
    ) => Promise<T>;
  };
  worker: {
    docx: () => {
      createReport: (c: any) => Promise<Uint8Array>;
    };
    tnFile: () => {
      generate: (d: any) => Promise<Uint8Array>;
    };
    zuschuesse: () => {
      generate: (d: any) => Promise<Uint8Array>;
    };
  };
  // }
}

declare module '@ctx' {
  export const getContext: () => ctx;
}

declare const __API_BASE_URL__: string;

declare const __BUILD_ID__: string;
