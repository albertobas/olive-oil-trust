import { EscrowSate, IMember } from 'next-app/src/features/shared/utils/interfaces';
import { ITransaction } from 'next-app/src/features/shared/core/entities/Events';
import { ITokensInfo } from 'next-app/src/features/shared/core/entities/Tokens';

export interface IEscrow {
  id: string;
  identifier: number;
  buyer: { member: IMember | null; id: string } | null;
  buyerWallet: string | null;
  contract: string;
  escrowBalance: {
    id: string;
    escrowAccount: string | null;
    tokensInfo: ITokensInfo | null;
  };
  etherBalance: {
    id: string;
    value: number | null;
    valueExact: number | null;
  };
  price: number | null;
  seller: IMember | null;
  sellerWallet: string | null;
  state: EscrowSate | null;
  tokenDeposits: { transaction: ITransaction }[];
}

export interface IEscrows {
  [escrowId: string]: IEscrow;
}
