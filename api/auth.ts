import { jwtVerify, SignJWT, importPKCS8 } from "jose";

const __ALG__ = "RS512";

const privateKey = await importPKCS8("", __ALG__);
const publicKey = await importPKCS8("", __ALG__);

interface Userdata {
  username: string;
  validUntil: string;

  email: string;
}

interface JWTData extends Userdata {
  rechte: Rechte;
}

type Rechte =
  | "admin"
  | { type: "leiter"; id: number; veranstaltung: string }
  | { type: "fzVerantwortlicher"; id: number; ort: string }
  | { type: "websiteOrt"; id: number; ort: string };

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
  allowed: Partial<Record<RechtTyp, number[] | number>>
) {
  if (r === "admin") return true;

  const rr = allowed[r.type];

  if (!rr) return false;

  if (typeof rr === "number") return rr === r.id;

  return rr.includes(r.id);
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
          str = `Leiter (${recht.veranstaltung})`;

          break;
        case "fzVerantwortlicher":
          str = `FZ für Ort ${recht.ort}`;
          break;
        case "websiteOrt":
          str = `Website für Ort ${recht.ort}`;
          break;
        default:
          break;
      }
    }

    tokens[str] = token;
  }

  return tokens;
}
