export interface FiatCurrency {
  uid: string;
  name: string;
  code: string;
  logo: string;
  symbol: string;
  cmcId: number;
  quote: number;
  createdAt: Date;
  updatedAt: Date;
}
