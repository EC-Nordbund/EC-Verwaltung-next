import { SendConfig, SmtpClient } from 'denomailer';

const client = new SmtpClient({
  console_debug: Deno.env.get('DEBUG') === 'on',
});

await client.connect({
  hostname: Deno.env.get('SMTP_HOST')!,
  port: parseInt(Deno.env.get('SMTP_PORT') ?? '25'),
  username: Deno.env.get('SMTP_USER'),
  password: Deno.env.get('SMTP_PWD'),
});

const que: {
  config: SendConfig;
  resolve: () => void;
  reject: (err: Error) => void;
}[] = [];

function add(config: SendConfig) {
  return new Promise<void>((resolve, reject) => {
    que.push({ config, resolve, reject });
  });
}

import { expose } from 'comlink';

export const api = {
  sendMail: add,
};

expose(api);

function wait() {
  return new Promise((res) => {
    setTimeout(res, 50);
  });
}

while (true) {
  while (que.length === 0) {
    await wait();
  }

  await client.send(que[0].config).then(que[0].resolve).catch(que[0].reject);

  que.splice(0, 1);
}
