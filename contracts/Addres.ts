export interface IAddress {
  addressId: string;
  coinId: string;
  price: number;
  network: string;
  symbol: string;
  logo: string;
  name: string;
  address: string;
}

export interface Address {
  uid: string;
  address: string;
  network: string;
  createdAt: Date;
  updatedAt: Date;
}
