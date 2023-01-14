import { Contract } from 'ethers';

export type EscrowCardAction =
  | 'makeOffer'
  | 'closeEscrow'
  | 'revertBeforePayment'
  | 'revertAfterPayment'
  | 'makePayment'
  | 'cancelPayment';

export interface IModalInfo {
  escrowId: string;
  escrowIdentifier: number;
  action: EscrowCardAction;
}

export interface IBreadcrumbs {
  label: string;
  href: string;
}

export interface IContractState {
  error: boolean | null;
  data: Contract | null;
}
