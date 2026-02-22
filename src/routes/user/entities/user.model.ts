export const UserRole = {
  administrator: 'administrator',
  moderator: 'moderator',
  user: 'user',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface IUser {
  id: string;

  name: string;
  cpf: string;
  email: string | null;
  phone: string | null;
  password: string;
  role: UserRole;
}
