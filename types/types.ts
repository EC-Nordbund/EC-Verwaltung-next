export interface User {
  user_id: number;
  username: string;
  name: string;
  email: string;
  valid_until: Date;
  is_admin: boolean;
}

export interface UserRecht {
  user_rechte_id: number;
  recht: string;
  recht_object_id: number;
  recht_object_name: string;
}

export type RechtTyp = 'leiter' | 'fzVerantwortlicher' | 'websiteOrt';
