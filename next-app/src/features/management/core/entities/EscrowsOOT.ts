import { IEscrowOOT } from 'next-app/src/features/shared/core/entities/EscrowsOOT';

export interface IEscrowsByAccountOOT {
  account: {
    asEscrowContract: {
      id: string;
      escrows: IEscrowOOT[] | null;
    }[];
  } | null;
}

export interface IEscrowsByMemberOOT {
  memberContract: {
    id: string;
    name: string | null;
    role: string | null;
    asAccount: {
      ownerOfEscrowContract: {
        id: string;
        escrows: IEscrowOOT[] | null;
      }[];
    };
  } | null;
}

export interface IEscrowsByBuyerOOT {
  escrows: IEscrowOOT[] | null;
}
