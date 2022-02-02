import { getContext } from '@ctx';

export default async (opts: {
  params: { id: string };
  body: { valid?: string };
}): Promise<boolean> => {
  const ctx = getContext();

  ctx.checkAuth();

  const newDate = opts.body.valid
    ? new Date(opts.body.valid)
    : new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100);

  await ctx.mysql.execute('UPDATE user SET valid_until = ? WHERE user_id = ?', [
    newDate,
    parseInt(opts.params.id),
  ]);

  ctx.invalidate('user');
  ctx.invalidate(`user:${opts.params.id}`);
  ctx.track(`user:${opts.params.id}:extend`, newDate.toISOString());

  return true;
};
