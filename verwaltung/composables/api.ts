import apiLogin from '@api/auth/login.post';
import { useAuthData } from './auth';

const { currentToken, tokenList, authToken } = useAuthData();

/**
 * Wird benutzt um die Authdaten in die API calls zu injecten
 *
 * @internal
 */
export function wrapFetchOptions(opts: RequestInit): RequestInit {
  if (!opts.headers) opts.headers = {};

  // Add auth header
  if (authToken.value) {
    (opts?.headers as Record<string, string>).authorization = authToken.value;
  }

  return opts;
}

/**
 * Login
 */
export async function login(username: string, password: string) {
  const tokens = await apiLogin({
    params: {},
    body: { username, password },
    query: {}
  });

  tokenList.value = tokens;
  if (currentToken.value && !tokenList.value[currentToken.value]) {
    currentToken.value = null;
  }

  if (Object.values(tokens).length === 1) {
    currentToken.value = Object.keys(tokens)[0];
  }

  return true;
}
