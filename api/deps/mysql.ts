import {
  Client,
  Connection,
  ExecuteResult,
} from "https://deno.land/x/mysql@v2.10.2/mod.ts";

export const client = new Client();

// client.connect()

type Result<T = unknown> = ExecuteResult | T[];

export function handleMysql(): [
  <T = unknown>(sql: string, params?: any[]) => Result<T>,
  () => Promise<void>
] {
  let con: Promise<Connection>;
  let first = true;

  let finalPromiseReturn: any = {};

  let query = async (sql: string, params?: any[]) => {
    if (first) {
      first = false;

      return new Promise((resolve, reject) => {
        con = new Promise((resolve2, reject2) => {
          client.useConnection(
            (newConnection) =>
              new Promise((res, rej) => {
                finalPromiseReturn = { res, rej };
                resolve2(newConnection);

                newConnection.execute("BEGIN");

                newConnection.query(sql, params).then(resolve).catch(reject);
              })
          );
        });
      });
    } else {
      return (await con).query(sql, params);
    }
  };

  return [
    query as any,
    async () => {
      if (!first) {
        await (await con).execute("COMMIT");

        finalPromiseReturn.res();
      }
    },
  ];
}
