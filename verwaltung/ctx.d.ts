/* eslint-disable @typescript-eslint/no-explicit-any */
import { RechtTyp } from '@types';

export interface ctx {
  gotenberg: any;
  user: any;
  checkAuth: (r: Partial<Record<RechtTyp, number | number[]>>) => boolean;
  mailer: {
    sendMail: (c: any) => Promise<void>;
  };
  login: (u: string, p: string) => Record<string, string>;
  hash: (d: string) => Promise<string>;
  mysql: {
    query: (sql: string, args: any[]) => Promise<any>
    useConnection: <T>(
      cb: (con: {
        query: (sql: string, args: any[]) => Promise<any>;
      }) => Promise<T>
    ) => Promise<T>;
    transaction: <T>(
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
}

export const getContext = () => ctx;