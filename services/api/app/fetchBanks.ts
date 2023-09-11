import { Bank } from '@contracts/Bank';

type FetchBanks = () => Promise<Array<Bank>>;
export const fetchBanks: FetchBanks = async () => [];
