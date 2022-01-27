import { Connection, ExecuteResult, Client } from "mysql";

export let client: Client;

export async function getClient() {
  if (!client) {
    client = new Client();
    await client.connect({
      charset: "utf-8",
      poolSize: 10,
      // TODO: full options
    });
  }

  return client;
}

type Result<T = unknown> = ExecuteResult | T[];

export function handleMysql(): [
  <T = unknown>(sql: string, params?: any[]) => Result<T>,
  () => Promise<void>
] {
  let con: Promise<Connection>;
  let first = true;

  let finalPromiseReturn: any = {};

  const query = async (sql: string, params?: any[]) => {
    if (first) {
      first = false;

      return new Promise((resolve, reject) => {
        con = new Promise(async (resolve2, reject2) => {
          (await getClient()).useConnection(
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
