import { User } from 'firebase/auth';

type AuthUser = User & {
  username?: string;
};

export { AuthUser };
