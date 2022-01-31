import { Connection, ExecuteResult, Client } from "mysql";

export const client = new Client();

await client.connect({
  /** Database hostname */
  hostname: Deno.env.get("DB_HOST"),
  /** Database username */
  username: Deno.env.get("DB_USER"),
  /** Database password */
  password: Deno.env.get("DB_PWD"),
  /** Database port */
  port: parseInt(Deno.env.get("DB_PORT") ?? "3306"),
  /** Database name */
  db: Deno.env.get("DB_DB"),
  /** Whether to display packet debugging information */
  debug: false,
  /** Connection read timeout (default: 30 seconds) */
  timeout: 30000,
  /** Connection pool size (default: 1) */
  poolSize: 10,
  /** Connection pool idle timeout in microseconds (default: 4 hours) */
  // idleTimeout: number;
  /** charset */
  charset: "utf8",
});

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
        con = new Promise((resolve2, _reject2) => {
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
        const c = await con;
        if (c.state === 1) {
          await c.execute("COMMIT");
        }

        finalPromiseReturn.res();
      }
    },
  ];
}
