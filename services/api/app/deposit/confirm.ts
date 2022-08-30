import { api } from '@services/api';

type DepositConfirm = (data: {
  depositId: string;
  receipt: File;
}) => Promise<void>;
export const depositConfirm: DepositConfirm = async ({
  depositId,
  receipt,
}) => {
  await api.putForm<{ data: null }>(`/api/fiat/deposit/confirm/${depositId}`, {
    receipt,
  });
};
