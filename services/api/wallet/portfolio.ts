type CurrencyData = {
  uid: string;
  name: string;
  code: string;
  quote: number;
  logo: string;
  amount: number;
  reserved: number;
  available: number;
};

type Portfolio = {
  crypto: CurrencyData[];
  fiat: CurrencyData[];
  total: number;
};

export const usersPortfolio = async (): Promise<Portfolio> => ({
  fiat: [],
  crypto: [],
  total: 0,
});
