import { IEscrows } from 'next-app/src/features/shared/core/entities/Escrows';
import { getEscrow } from 'next-app/src/features/shared/utils/helpers/escrow';
import { AllEscrowsQuery } from 'next-app/.graphclient';

function allEscrowsAdapter(dataRaw: AllEscrowsQuery): IEscrows | null {
  if (dataRaw.escrows.length > 0) {
    const escrows: IEscrows = {};
    for (let i = 0; i < dataRaw.escrows.length; i++) {
      const escrowRaw = dataRaw.escrows[i];
      escrows[escrowRaw.id] = getEscrow(escrowRaw, null);
    }
    return escrows;
  }
  return null;
}

export default allEscrowsAdapter;
