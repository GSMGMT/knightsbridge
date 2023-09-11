type DepositConfirm = (data: {
  depositId: string;
  receipt: File;
}) => Promise<void>;
export const depositConfirm: DepositConfirm = async () => {};
