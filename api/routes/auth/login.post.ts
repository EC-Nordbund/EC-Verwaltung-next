import { getContext } from '@ctx';

export default async ({
  body: options,
}: {
  params: Record<never, never>;
  query: Record<never, never>;
  body: { username: string; password: string };
}): Promise<Record<string, string>> => {
  const ctx = getContext();

  const res = await ctx.login(options.username, options.password);

  ctx.track('login');

  return res;
};
