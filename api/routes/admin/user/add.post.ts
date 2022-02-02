import { getContext } from '@ctx';

import { User } from '@types';

export default async (opts: {
  body: Omit<User, 'user_id' | 'valid_until'>;
}): Promise<number> => {
  const ctx = getContext();

  ctx.checkAuth();

  const salt = await ctx.hash(
    `${
      new Date().toISOString()
    }${Math.random()}${opts.body.name}${opts.body.email}`,
  );
  const pwd = (await ctx.hash(
    `pwd${
      new Date().toISOString()
    }${Math.random()}${opts.body.name}${opts.body.email}`,
  )).slice(0, 16);

  const hash = await ctx.hash(`${ctx.__PEPPER__}${salt}${pwd}`);

  const valid = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 100);

  const res = await ctx.mysql.execute(
    'INSERT into user (name, username, email, is_admin, salt, password, valid_until) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      opts.body.name,
      opts.body.username,
      opts.body.email,
      opts.body.is_admin,
      salt,
      hash,
      valid,
    ],
  );

  await ctx.mailer.sendMail({
    // deno-lint-ignore no-explicit-any
    to: opts.body.email as any,
    from: 'auto@ec-nordbund.de',
    subject: 'Dein Verwaltungs-Account beim EC-Nordbund',
    html: `
      <p>Hallo ${opts.body.name}, <br>Du hast einen Account Username: ${opts.body.username} mit PWD: ${pwd}</p>
    `,
  });

  ctx.invalidate('user');

  console.log(res);

  return res.lastInsertId!;
};
