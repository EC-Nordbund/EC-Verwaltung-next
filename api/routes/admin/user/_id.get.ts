import { getContext } from "@ctx";

export interface User {
  user_id: number;
  username: string;
  name: string;
  valid_until: Date;
  is_admin: boolean;
}

export default async (opts: {
  params: { id: string };
  query: Record<never, never>;
  body: Record<never, never>;
}) => {
  const ctx = getContext();

  ctx.checkAuth({
    admin: 0,
  });

  const user = (
    await ctx.mysql.query(
      "SELECT user_id, username, name, valid_until, is_admin FROM user WHERE user_id = ?",
      [parseInt(opts.params.id)],
    )
  )[0] as unknown as User;

  const rechte = (await ctx.mysql.query(
    "SELECT * FROM user_rechte WHERE user_id = ?",
    [parseInt(opts.params.id)],
  )) as {
    user_rechte_id: number;
    recht: string;
    recht_object_id: number;
    recht_object_name: string;
  }[];

  // const res = await ctx.login(options.username, options.password);

  return {
    user,
    rechte,
  };
};
