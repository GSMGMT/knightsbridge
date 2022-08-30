import { InsertDepositDTO } from '@pages/api/fiat/deposit';
import { FiatDeposit } from '@contracts/FiatDeposit';
import { api } from '@services/api';

type CreateDeposit = (data: InsertDepositDTO) => Promise<FiatDeposit>;
export const createDeposit: CreateDeposit = async (data) => {
  const {
    data: { data: deposit },
  } = await api.post<{ data: FiatDeposit }>('/api/fiat/deposit', data);

  return deposit;
};
