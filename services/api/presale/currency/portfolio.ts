export type PresaleData = {
  uid: string;
  name: string;
  code: string;
  quote: number;
  price: number;
  logo: string;
  balance: number;
  amount: number;
  baseCurrency: string;
};

type Portfolio = {
  assets: PresaleData[];
  total: number;
};

export const usersPresalePortfolio = async (): Promise<Portfolio> => ({
  assets: [],
  total: 0,
});
