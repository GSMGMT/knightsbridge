import { FIATDepositStatus, FiatDeposit } from '@contracts/FiatDeposit';

type CreateDeposit = (data: { amount: number }) => FiatDeposit;
export const createDeposit: CreateDeposit = (data) => ({
  amount: data.amount,
  bank: {
    accountName: 'John Doe',
    accountNumber: '1234567890',
    address: '123 Main St',
    bankAddress: '123 Main St',
    bankName: 'Bank of America',
    branch: '123 Main St',
    paymentMethod: 'BANK_TRANSFER',
    swiftCode: '1234567890',
    uid: 'c2d0f7e0-8e2a-4b0a-9b6e-7b6c5c6e9c1a',
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  currency: {
    uid: '24a0f7e0-8e2a-4b0a-9b6e-7b6c5c6e9c1a',
    cmcId: 2781,
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2781.png',
    name: 'US Dollar',
    symbol: 'USD',
    type: 'fiat',
    deposit: true,
    quote: 1,
    sign: '$',
    walletAddresses: [],
  },
  user: {
    email: 'email@example.com',
    name: 'John',
    surname: 'Doe',
    uid: 'c2d0f7e0-8e2a-4b0a-9b6e-7c6c5c6e9c1a',
  },
  referenceNo: '1234567890',
  status: FIATDepositStatus.PENDING,
});
