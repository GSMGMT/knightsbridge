export interface Exchange {
  id: string;
  logo: string;
  name: string;
  slug: string;
}

export interface Pair {
  id: number;
  logo: string;
  name: string;
  base: {
    id: number;
    type: string;
  };
  pair: {
    id: number;
    type: string;
  };
}
