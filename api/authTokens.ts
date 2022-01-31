import { importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose";

const __ALG__ = "RS512";

const privateKey = await importPKCS8(
  await Deno.readTextFile(
    new URL("./files/private_unencrypted.pem", import.meta.url),
  ),
  __ALG__,
);

const publicKey = await importSPKI(
  await Deno.readTextFile(new URL("./files/public.pem", import.meta.url)),
  __ALG__,
);

interface Userdata {
  username: string;
  validUntil: string;

  email: string;
  name: string;
}

interface JWTData extends Userdata {
  rechte: Rechte;
}

type Rechte =
  | "admin"
  | { type: "leiter"; id: number; name: string }
  | { type: "fzVerantwortlicher"; id: number; name: string }
  | { type: "websiteOrt"; id: number; name: string };

export async function check(key: string): Promise<JWTData> {
  const ret = await jwtVerify(key, publicKey, {
    algorithms: [__ALG__],
    issuer: ["ec"],
    clockTolerance: 0,
  });

  return ret.payload.user as JWTData;
}

export type RechtTyp = "leiter" | "fzVerantwortlicher" | "websiteOrt";

export function checkAuth(
  r: Rechte,
  allowed: Partial<Record<RechtTyp | "admin", number[] | number>>,
) {
  if (r === "admin") return true;

  const rr = allowed[r.type];

  if (!rr) throw new Error("Du hast nicht die benötigten Rechte!");

  if (typeof rr === "number") {
    if (rr === r.id) throw new Error("Du hast nicht die benötigten Rechte!");

    return true;
  }

  if (!rr.includes(r.id)) {
    throw new Error("Du hast nicht die benötigten Rechte!");
  }

  return true;
}

async function generateJWT(user: Userdata, rechte: Rechte) {
  const jwt = await new SignJWT({
    user: {
      ...user,
      rechte,
    },
  })
    .setProtectedHeader({
      alg: __ALG__,
    })
    .setIssuer("ec")
    .setIssuedAt()
    .setExpirationTime("6 hours")
    .sign(privateKey, {});

  return jwt;
}

export async function createTokenSet(user: Userdata, rechte: Rechte[]) {
  const tokens: Record<string, string> = {};

  for (let i = 0; i < rechte.length; i++) {
    const token = await generateJWT(user, rechte[i]);

    const recht = rechte[i];

    let str = "";

    if (recht === "admin") {
      str = "Administrator";
    } else {
      switch (recht.type) {
        case "leiter":
          str = `Leiter (${recht.name})`;

          break;
        case "fzVerantwortlicher":
          str = `FZ für Ort ${recht.name}`;
          break;
        case "websiteOrt":
          str = `Website für Ort ${recht.name}`;
          break;
        default:
          break;
      }
    }

    tokens[str] = token;
  }

  return tokens;
}
