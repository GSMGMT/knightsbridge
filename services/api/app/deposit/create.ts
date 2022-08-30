import { InsertDepositDTO } from '@pages/api/fiat/deposit';
import { Deposit } from '@contracts/FiatDeposit';
import { api } from '@services/api';

type CreateDeposit = (data: InsertDepositDTO) => Promise<Deposit>;
export const createDeposit: CreateDeposit = async (data) => {
  const {
    data: { data: deposit },
  } = await api.post<{ data: Deposit }>('/api/fiat/deposit', data);

  return deposit;
};
