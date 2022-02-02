import { client } from './mysql.ts';
import { createTokenSet, Rechte } from './authTokens.ts';
const byteToHex: string[] = [];

for (let n = 0; n <= 0xff; ++n) {
  const hexOctet = n.toString(16).padStart(2, '0');
  byteToHex.push(hexOctet);
}

function hex(arrayBuffer: ArrayBuffer) {
  const buff = new Uint8Array(arrayBuffer);
  const hexOctets = []; // new Array(buff.length) is even faster (preallocates necessary array size), then use hexOctets[i] instead of .push()

  for (let i = 0; i < buff.length; ++i) hexOctets.push(byteToHex[buff[i]]);

  return hexOctets.join('');
}

const textEncoder = new TextEncoder();

export async function hash(str: string) {
  return hex(await crypto.subtle.digest('sha-512', textEncoder.encode(str)));
}

export const __PEPPER__ = Deno.env.get('PEPPER') ?? '25r384o23ju4nhrf3uq';

export async function login(username: string, password: string) {
  return await client.useConnection(async (con) => {
    const data = (await con.query(
      'SELECT * FROM user WHERE username = ? AND valid_until > NOW()',
      [username],
    )) as
      | [
        {
          user_id: number;
          username: string;
          password: string;
          email: string;
          salt: string;
          name: string;
          valid_until: Date;
          is_admin: boolean;
        },
      ]
      | [];

    if (data.length === 0) {
      throw new Error('Benutzername oder Passwort sind falsch!');
    }

    const pwdHash = await hash(`${__PEPPER__}${data[0].salt}${password}`);

    if (pwdHash !== data[0].password) {
      throw new Error('Benutzername oder Passwort sind falsch!');
    }

    const rechte: Rechte[] = (
      (await con.query('SELECT * FROM user_rechte WHERE user_id = ?', [
        data[0].user_id,
      ])) as {
        recht: string;
        recht_object_id: number;
        recht_object_name: string;
      }[]
    ).map(
      (v) => ({
        type: v.recht,
        id: v.recht_object_id,
        name: v.recht_object_name,
      } as Rechte),
    );

    if (data[0].is_admin) {
      rechte.push('admin');
    }

    return createTokenSet(
      {
        username,
        email: data[0].email,
        validUntil: data[0].valid_until.toISOString().split('T')[0],
        name: data[0].name,
      },
      rechte,
    );
  });
}
