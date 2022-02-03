import { getContext } from '@ctx';

export default async (opts: {
  params: { id: string };
  body: { name: string; recht: string; id: number };
}): Promise<number> => {
  const ctx = getContext();

  ctx.checkAuth();

  const res = await ctx.mysql.execute(
    'INSERT INTO user_rechte (user_id, recht, recht_object_id, recht_object_name) VALUES (?,?,?,?)',
    [
      parseInt(opts.params.id),
      opts.body.recht,
      opts.body.id,
      opts.body.name,
    ],
  );

  ctx.invalidate(`user:${opts.params.id}`);
  ctx.track(`user:${opts.params.id}:rechte:add`, opts.body);

  return res.lastInsertId!;
};
