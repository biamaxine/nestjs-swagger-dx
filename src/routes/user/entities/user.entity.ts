import { IUser, UserRole } from './user.model';

export class User implements IUser {
  readonly id: string = crypto.randomUUID();

  name: string;
  cpf: string;
  email: string | null;
  phone: string | null;
  password: string;
  role: UserRole;

  readonly created_at: Date = new Date();
  private _updated_at: Date = new Date();
  private _deleted_at: Date | null = null;

  constructor(
    props: Omit<IUser, 'id' | 'email' | 'phone' | 'role'> &
      Partial<Pick<IUser, 'phone' | 'role'>> & { email: string },
  ) {
    this.name = props.name;
    this.cpf = props.cpf;
    this.email = props.email;
    this.phone = props.phone || null;
    this.password = props.password;
    this.role = props.role || UserRole.user;
  }

  get updated_at() {
    return this._updated_at;
  }

  get deleted_at() {
    return this._deleted_at;
  }

  get is_active() {
    return this._deleted_at === null;
  }

  update(props: Partial<Omit<IUser, 'id' | 'email'>> & { email?: string }) {
    if (Object.keys(props).length === 0) return;

    const { name, cpf, email, phone, password, role } = props;

    if (name) this.name = name;
    if (cpf) this.cpf = cpf;
    if (email) this.email = email;
    if (phone !== undefined) this.phone = phone;
    if (password) this.password = password;
    if (role) this.role = role;

    this._updated_at = new Date();
  }

  disable() {
    this.email = null;
    this.phone = null;
    this._deleted_at = new Date();
  }

  enable(email: string) {
    this.email = email;
    this._deleted_at = null;
  }
}
