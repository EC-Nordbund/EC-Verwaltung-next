import { getContext } from "../ctx.ts?ctx";

export default async (_options: {
  params: {};
  query: {
    limit: 10;
    offset: 20;
  };
  body: {};
}) => {
  const ctx = getContext();

  // ctx.auth(["admin", "usera"]);

  // In ctx gibt es session cookie user_id etc. die aber NICHT die definition dieser funktion "verschmutzen" sollen

  return {
    data: 43,
  };
};
