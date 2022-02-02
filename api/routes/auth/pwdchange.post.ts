import { getContext } from '@ctx';

export default async ({
  body: options,
}: {
  body: { oldPassword: string; password: string };
}): Promise<boolean> => {
  const ctx = getContext();

  if (!ctx.user) throw new Error('Nicht Authentifiziert!');
  if (options.password.length < 8) throw new Error('Nicht Authentifiziert!');

  await ctx.mysql.useConnection(async (con) => {
    const data =
      (await con.query('SELECT salt, password FROM user WHERE user_id = ?', [
        ctx.user!.user_id,
      ]) as [{ salt: string; password: string }])[0];

    const oldHash = await ctx.hash(
      `${ctx.__PEPPER__}${data.salt}${options.oldPassword}`,
    );

    if (oldHash !== data.password) {
      throw new Error('Nicht Authentifiziert!');
    }

    const newSalt = await ctx.hash(
      `${new Date().toISOString()}${Math.random()}${oldHash}${data.salt}`,
    );
    const newPWDHash = await ctx.hash(
      `${ctx.__PEPPER__}${newSalt}${options.password}`,
    );

    await con.execute(
      'UPDATE user SET salt = ?, password = ? WHERE user_id = ?',
      [newSalt, newPWDHash, ctx.user!.user_id],
    );
  });

  ctx.track('passwordchange');

  return true;
};
