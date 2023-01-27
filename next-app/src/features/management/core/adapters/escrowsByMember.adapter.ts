import { IEscrows } from 'next-app/src/features/shared/core/entities/Escrows';
import { getEscrow } from 'next-app/src/features/shared/utils/helpers';
import { IEscrowsByMemberOOT } from 'next-app/src/features/management/core/entities/MyEscrowsOOT';

const escrowsByMemberAdapter = (dataRaw: IEscrowsByMemberOOT | undefined): IEscrows | null => {
  if (dataRaw && dataRaw.memberContract) {
    const { ownerOfEscrowContract } = dataRaw.memberContract.asAccount;
    const data: IEscrows = {};
    for (let i = 0; i < ownerOfEscrowContract.length; i++) {
      const { escrows } = ownerOfEscrowContract[i];
      if (escrows && escrows.length > 0) {
        for (let j = 0; j < escrows.length; j++) {
          const escrowOOT = escrows[j];
          data[escrowOOT.id] = getEscrow(escrowOOT, null);
        }
      }
    }
    return Object.keys(data).length > 0 ? data : null;
  }
  return null;
};

export default escrowsByMemberAdapter;
