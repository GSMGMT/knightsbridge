import { useRouter } from 'next/router';
import { FunctionComponent, useMemo } from 'react';

import { Link, LinkProps } from '../Link';

type NavLinkProps = Omit<LinkProps, 'className'> & {
  className?: string | ((args: { isActive: boolean }) => string);
};
export const NavLink: FunctionComponent<NavLinkProps> = ({
  children,
  className: classNameDefault,
  ...props
}) => {
  const { href } = props;

  const { pathname } = useRouter();

  const isActive = useMemo(() => pathname === href, [pathname, href]);

  const className = useMemo(() => {
    if (typeof classNameDefault === 'function') {
      return classNameDefault({ isActive });
    }

    return classNameDefault;
  }, [isActive]);

  return (
    <Link {...props} className={className}>
      {children}
    </Link>
  );
};
NavLink.defaultProps = {
  className: undefined,
};
