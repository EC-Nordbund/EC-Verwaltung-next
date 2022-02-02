import { getContext } from '@ctx';

export default async (opts: {
  params: { id: string; rechtid: string };
}): Promise<boolean> => {
  const ctx = getContext();

  ctx.checkAuth();

  const user_id = parseInt(opts.params.id);
  const recht_id = parseInt(opts.params.rechtid);

  const res = await ctx.mysql.execute(
    'DELETE FROM user_rechte WHERE user_id = ? AND user_rechte_id = ?',
    [user_id, recht_id],
  );

  ctx.invalidate(`user:${user_id}`)

  return (res?.affectedRows || 0) > 0;
};
