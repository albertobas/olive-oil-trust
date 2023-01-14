import { IEscrows } from 'next-app/src/features/shared/core/entities/Escrows';
import { getEscrow } from 'next-app/src/features/shared/utils/helpers';
import { IAllEscrowsOOT } from 'next-app/src/features/explore/core/entities/EscrowsOOT';

function allEscrowsAdapter(dataRaw: IAllEscrowsOOT | undefined): IEscrows | null {
  if (dataRaw && dataRaw.escrows) {
    let escrows: IEscrows | null = null;
    if (dataRaw.escrows.length > 0) {
      escrows = {};
      for (let i = 0; i < dataRaw.escrows.length; i++) {
        const escrowOOT = dataRaw.escrows[i];
        escrows[escrowOOT.id] = getEscrow(escrowOOT, null);
      }
    }
    return escrows;
  }
  return null;
}

export default allEscrowsAdapter;
