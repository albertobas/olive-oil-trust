import { IMember } from 'next-app/src/features/shared/utils/interfaces';
import { ITransactionOOT } from 'next-app/src/features/shared/core/entities/EventsOOT';
import { ITokenFieldsOOT } from 'next-app/src/features/shared/core/entities/TokensOOT';

export interface IEscrowOOT {
  id: string;
  buyer: {
    id: string;
    asMemberContract: IMember | null;
  } | null;
  buyerWallet: string | null;
  contract: {
    id: string;
    owner: {
      asMemberContract: {
        id: string;
        name: string | null;
        role: string | null;
      } | null;
    } | null;
  };
  escrowId: string;
  escrowBalance: {
    id: string;
    escrowAccount: {
      id: string;
    };
    escrowAmounts: string[];
    escrowTokens: ITokenFieldsOOT[] | null;
  };
  etherBalance: {
    id: string;
    value: string | null;
    valueExact: string | null;
  };
  identifier: string;
  price: string | null;
  seller: {
    id: string;
    asMemberContract: {
      id: string;
      name: string | null;
      role: string | null;
    } | null;
  } | null;
  sellerWallet: string | null;
  state: string | null;
  tokenDeposits: { transaction: ITransactionOOT }[];
}
