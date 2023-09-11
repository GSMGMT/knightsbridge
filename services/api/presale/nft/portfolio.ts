export type PresaleData = {
  uid: string;
  name: string;
  author: string;
  quote: number;
  icon: string;
  baseCurrency: string;
};

export type Portfolio = {
  assets: PresaleData[];
};

export const usersPresalePortfolio = async (): Promise<Portfolio> => ({
  assets: [],
});
