import { AnchorHTMLAttributes } from 'react';
import LinkDefault from 'next/link';

export type LinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> & {
  href: string;
};
export const Link = ({ href, children, ...props }: LinkProps) => (
  <LinkDefault href={href}>
    <a {...props}>{children}</a>
  </LinkDefault>
);
