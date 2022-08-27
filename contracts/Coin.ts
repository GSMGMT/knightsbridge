export interface Value {
  value: number;
  percent: number;
}

export interface Coin {
  id: string;
  cmcId: number;
  key: string;
  name: string;
  logo: string;
  coinType: string;
  isDeleted: boolean;
  isActive: boolean;
  quote: {
    price: number;
    volume24h: Value;
    price24h: Value;
    high24h: Value;
    low24h: Value;
  };
}
