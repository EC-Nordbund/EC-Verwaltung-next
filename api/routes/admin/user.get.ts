import { getContext } from "@ctx";

export interface User {
  user_id: number;
  username: string;
  name: string;
  valid_until: Date;
  is_admin: boolean;
}

export default async (_opts: {
  params: Record<never, never>;
  query: Record<never, never>;
  body: Record<never, never>;
}) => {
  const ctx = getContext();

  ctx.checkAuth({
    admin: 0,
  });

  const res = (await ctx.mysql.query(
    "SELECT user_id, username, name, valid_until, is_admin FROM user"
  )) as User[];

  // const res = await ctx.login(options.username, options.password);

  return res;
};
