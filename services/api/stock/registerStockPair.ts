interface RegisterStockPairDTO {
  symbol: string;
}
type RegisterStockPair = (data: RegisterStockPairDTO) => Promise<string>;
export const registerStockPair: RegisterStockPair = async () =>
  'f23abf3a-4c7e-4b6a-8b8a-2b5d8b9a7c2a';
