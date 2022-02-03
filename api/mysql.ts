import { Client } from 'mysql';

export const client = new Client();

await client.connect({
  /** Database hostname */
  hostname: Deno.env.get('DB_HOST'),
  /** Database username */
  username: Deno.env.get('DB_USER'),
  /** Database password */
  password: Deno.env.get('DB_PWD'),
  /** Database port */
  port: parseInt(Deno.env.get('DB_PORT') ?? '3306'),
  /** Database name */
  db: Deno.env.get('DB_DB'),
  /** Whether to display packet debugging information */
  debug: false,
  /** Connection read timeout (default: 30 seconds) */
  timeout: 30000,
  /** Connection pool size (default: 1) */
  poolSize: 10,
  /** Connection pool idle timeout in microseconds (default: 4 hours) */
  // idleTimeout: number;
  /** charset */
  charset: 'utf8',
});
