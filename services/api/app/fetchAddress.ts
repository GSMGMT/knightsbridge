import { Currency } from '@contracts/Currency';

interface RequestArgs {
  size?: number;
}
interface Response {
  coins: Currency[];
}

export const fetchAddress: (
  args: RequestArgs
) => Promise<Response> = async () => ({ coins: [] });
