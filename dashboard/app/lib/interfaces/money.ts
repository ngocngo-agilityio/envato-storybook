export type TMoney = {
  amount: number;
};

export type TAddMoney = TMoney & {
  userId: string;
};

export type TSendMoney = TAddMoney & {
  memberId: string;
};

export type TMoneyResponse = {
  message: string;
};

export type TTransfer = {
  amount: string;
  memberId: string;
  userId: string;
};

export type TTransferDirtyFields = {
  [K in keyof TTransfer]?: Readonly<boolean>;
};
