import { getContext } from '@ctx';
import type { User } from '@types';

export default (): Promise<User[]> => {
  const ctx = getContext();

  ctx.checkAuth();

  return ctx.mysql.query(
    'SELECT user_id, username, name, valid_until, is_admin FROM user',
  );
};
