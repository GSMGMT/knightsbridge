/* eslint-disable no-constant-condition */
import { AdminNavigation } from './Admin';

import { UserNavigation } from './User';

interface NavigationProps {
  setVisibleNav: (visible: boolean) => void;
}
export const Navigation = ({ setVisibleNav }: NavigationProps) =>
  false ? (
    <AdminNavigation setVisibleNav={setVisibleNav} />
  ) : (
    <UserNavigation setVisibleNav={setVisibleNav} />
  );
