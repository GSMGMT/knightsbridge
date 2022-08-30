import { GetServerSidePropsContext, PreviewData } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { parseCookies } from 'nookies';

export const login: (
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => boolean = (ctx) => {
  const { 'knightsbridge.login': userPrevious } = parseCookies(ctx);

  return !!userPrevious;
};
