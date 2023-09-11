import { Request } from '@contracts/Request';

interface User {
  name: string;
  surname: string;
  email: string;
  referral: string;
  role: 'ADMIN' | 'USER';
  verified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
export type Users = Array<User>;

type RequestArgs = Omit<Request, 'startDate' | 'endDate'> & {
  sort: Pick<Request, 'sort'>;
};
interface Response {
  users: Users;
  totalCount: number;
}

export const fetchUsers: (
  args: RequestArgs
) => Promise<Response> = async () => ({ users: [], totalCount: 0 });
