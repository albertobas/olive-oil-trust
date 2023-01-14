import { IEscrows } from 'next-app/src/features/shared/core/entities/Escrows';
import { getEscrow } from 'next-app/src/features/shared/utils/helpers';
import { IEscrowsByBuyerOOT } from 'next-app/src/features/management/core/entities/EscrowsOOT';

const escrowsByBuyerAdapter = (dataRaw: IEscrowsByBuyerOOT | undefined): IEscrows | null => {
  if (dataRaw && dataRaw.escrows && dataRaw.escrows.length > 0) {
    const data: IEscrows = {};
    for (let i = 0; i < dataRaw.escrows.length; i++) {
      const escrowOOT = dataRaw.escrows[i];
      data[escrowOOT.id] = getEscrow(escrowOOT, null);
    }
    return Object.keys(data).length > 0 ? data : null;
  }
  return null;
};

export default escrowsByBuyerAdapter;
