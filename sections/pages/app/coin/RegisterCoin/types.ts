export interface Exchange {
  cmcId: string;
  logo: string;
  name: string;
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
