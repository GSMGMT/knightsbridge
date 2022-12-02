export interface Source {
  id: string;
  name: string;
}

export interface Stock {
  id: string;
  name: string;
  symbol: string;
}

export interface Equity extends Stock {
  source: Source;
  price: number;
}
