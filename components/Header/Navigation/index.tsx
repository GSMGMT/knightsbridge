import { useContext } from 'react';

import { AuthContext } from '@store/contexts/Auth';

import { AdminNavigation } from './Admin';

import { UserNavigation } from './User';

interface NavigationProps {
  setVisibleNav: (visible: boolean) => void;
}
export const Navigation = ({ setVisibleNav }: NavigationProps) => {
  const { isAdmin } = useContext(AuthContext);

  return isAdmin ? (
    <AdminNavigation setVisibleNav={setVisibleNav} />
  ) : (
    <UserNavigation setVisibleNav={setVisibleNav} />
  );
};
