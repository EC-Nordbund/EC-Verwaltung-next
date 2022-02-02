import { getContext } from '@ctx';

import { User, UserRecht } from '@types';

export default (opts: {
  params: { id: string };
}): Promise<{ user: User; rechte: UserRecht[] }> => {
  const ctx = getContext();

  ctx.checkAuth();

  const user_id = parseInt(opts.params.id);

  return ctx.mysql.useConnection(async (con) => {
    const user = (
      await con.query(
        'SELECT user_id, username, name, valid_until, is_admin, email FROM user WHERE user_id = ?',
        [user_id],
      ) as [User]
    )[0];

    const rechte = (await con.query(
      'SELECT * FROM user_rechte WHERE user_id = ?',
      [user_id],
    )) as UserRecht[];

    return {
      user,
      rechte,
    };
  });
};
