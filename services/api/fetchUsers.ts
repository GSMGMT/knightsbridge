import { api } from '@services/api';

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

export const fetchUsers: (args: RequestArgs) => Promise<Response> = async ({
  ...params
}) => {
  let newUsers: Users = [];
  let newTotalCount: Response['totalCount'] = 0;

  try {
    const {
      data: { data, totalCount },
    } = await api.get<{
      data: Array<
        Omit<User, 'lastLogin' | 'createdAt' | 'updatedAt'> & {
          lastLogin: string;
          createdAt: string;
          updatedAt: string;
        }
      >;
      totalCount: number;
    }>('/api/user/list', {
      params,
    });

    newUsers = data.map(
      ({ lastLogin, createdAt, updatedAt, ...user }) =>
        ({
          ...user,
          lastLogin: new Date(lastLogin),
          createdAt: new Date(createdAt),
          updatedAt: new Date(updatedAt),
        } as User)
    );
    newTotalCount = totalCount;
  } catch (error) {
    console.error({ error });
  }

  return { users: [...newUsers], totalCount: newTotalCount };
};
