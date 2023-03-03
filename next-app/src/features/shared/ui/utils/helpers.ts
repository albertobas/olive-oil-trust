import { Contract } from 'ethers';
import {
  Buyer,
  EscrowSate,
  IContract,
  IMember,
  OliveOilBottleEscrow,
  Role,
  Seller
} from 'next-app/src/features/shared/utils/interfaces';
import { EscrowCardAction, IModalInfo } from 'next-app/src/features/shared/ui/utils/interfaces';
import { Escrow } from 'next-app/src/features/shared/core/entities/Escrows';

export function handleAddressValidation(value: string): string | null {
  if (!value) {
    return 'A recipient is required';
  } else if (!/^(0x)?[0-9a-f]{40}$/i.test(value)) {
    return 'The recipient address is invalid';
  }
  return null;
}

export function handlePriceValidation(value: string): string | null {
  if (value.length === 0) {
    return 'An amount is required';
  } else if (!/^\d*\.?\d{0,18}$/i.test(value)) {
    return 'Amount must be numeric and can only contain up to 18 decimals';
  }
  return null;
}

export function handleSelectValidation(value: string | null, subject: string): string | null {
  if (value === null || (value && value.length === 0)) {
    return `A ${subject} is required`;
  }
  return null;
}

export async function transferEscrowActions(
  signedMemberContract: Contract | null,
  signedEscrowContract: Contract | null,
  escrow: Escrow,
  modalInfo: IModalInfo | null,
  isMember: boolean
): Promise<void> {
  if (escrow) {
    if (modalInfo) {
      if (escrow.contract) {
        if (isMember) {
          if (signedMemberContract) {
            if (modalInfo.action === 'revertBeforePayment') {
              await (signedMemberContract as Seller).revertBeforePayment(escrow.identifier);
            } else if (modalInfo.action === 'revertAfterPayment') {
              await (signedMemberContract as Seller).revertAfterPayment(escrow.identifier);
            } else if (modalInfo.action === 'cancelPayment') {
              await (signedMemberContract as Buyer).cancelPayment(escrow.contract, escrow.identifier);
            } else if (modalInfo.action === 'closeEscrow') {
              await (signedMemberContract as Seller).closeEscrow(escrow.identifier);
            } else {
              throw new Error('Wrong method');
            }
          } else {
            throw new Error('An abstraction of the contract could not be created');
          }
        } else {
          if (signedEscrowContract) {
            if (modalInfo.action === 'cancelPayment') {
              await (signedEscrowContract as OliveOilBottleEscrow).cancelPayment(escrow.identifier);
            } else {
              throw new Error('Wrong method');
            }
          } else {
            throw new Error('An abstraction of the contract could not be created');
          }
        }
      } else {
        throw new Error('The address of the escrow is nod specified');
      }
    } else {
      throw new Error('Data of the selected escrow card could not be gathered');
    }
  } else {
    throw new Error('Data of the selected escrow could not be gathered');
  }
}

export function shouldShowAction(
  accountContract: IContract | null,
  sellerMember: IMember | null,
  action: EscrowCardAction,
  state: EscrowSate | null,
  isSeller: boolean
): boolean {
  function isProperAction(role: Role | null): boolean {
    if (state) {
      if (state === 'Active') {
        if (isSeller) {
          if (action === 'revertBeforePayment') {
            return true;
          }
        } else {
          if (role === 'OliveGrower') {
            if (action === 'makeOffer') {
              return true;
            }
          } else {
            if (action === 'makePayment') {
              return true;
            }
          }
        }
        return false;
      }
      if (state === 'EtherDeposited') {
        if (isSeller) {
          if (action === 'revertAfterPayment') {
            return true;
          }
          if (action === 'closeEscrow') {
            return true;
          }
        } else {
          if (action === 'cancelPayment') {
            return true;
          }
        }
        return false;
      }
      if (state === 'RevertedBeforePayment' || state === 'RevertedAfterPayment' || state === 'Closed') {
        return false;
      }
      return false;
    }
    return false;
  }

  if (sellerMember) {
    const { id, role } = sellerMember;

    if (role === 'Retailer') {
      if (accountContract && accountContract.moduleId) {
        const accountRole = accountContract.moduleId.replace('Upgradeable', '');
        if (accountRole !== 'Retailer') {
          return false;
        }
      }
      return isProperAction(role);
    }
    if (accountContract && accountContract.moduleId) {
      const isOwnedEscrow = accountContract.address === id;
      const accountRole = accountContract.moduleId.replace('Upgradeable', '');
      if (accountRole === role) {
        if (isOwnedEscrow) {
          return isProperAction(role);
        }
        return false;
      }
      if (role === 'OliveGrower') {
        if (accountRole === 'OliveOilMill') {
          return isProperAction(role);
        }
        return false;
      }
      if (role === 'OliveOilMill') {
        if (accountRole === 'BottlingPlant') {
          return isProperAction(role);
        }
        return false;
      }
      if (role === 'BottleManufacturer') {
        if (accountRole === 'BottlingPlant') {
          return isProperAction(role);
        }
        return false;
      }
      if (role === 'BottlingPlant') {
        if (accountRole === 'Distributor') {
          return isProperAction(role);
        }
        return false;
      }
      if (role === 'Distributor') {
        if (accountRole === 'Retailer') {
          return isProperAction(role);
        }
        return false;
      }
    }
    return false;
  }
  return false;
}
