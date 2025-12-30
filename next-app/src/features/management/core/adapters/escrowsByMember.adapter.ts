import { Escrows } from '@features/shared/core/entities/Escrows';
import { getEscrow } from '@features/shared/utils/helpers/escrow';
import { EscrowsByMemberQuery } from '.graphclient';

const escrowsByMemberAdapter = (dataRaw: EscrowsByMemberQuery): Escrows | null => {
  if (dataRaw.memberContract) {
    const { ownerOfEscrowContract } = dataRaw.memberContract.asAccount;
    const data: Escrows = {};
    for (let i = 0; i < ownerOfEscrowContract.length; i++) {
      const { escrows } = ownerOfEscrowContract[i];
      if (escrows && escrows.length > 0) {
        for (let j = 0; j < escrows.length; j++) {
          const escrowRaw = escrows[j];
          data[escrowRaw.id] = getEscrow(escrowRaw, null);
        }
      }
    }
    return Object.keys(data).length > 0 ? data : null;
  }
  return null;
};

export default escrowsByMemberAdapter;
