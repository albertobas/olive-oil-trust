import { IEscrows } from 'next-app/src/features/shared/core/entities/Escrows';
import { getEscrow } from 'next-app/src/features/shared/utils/helpers/escrow';
import { EscrowsByBuyerQuery } from 'next-app/.graphclient';

const escrowsByBuyerAdapter = (dataRaw: EscrowsByBuyerQuery): IEscrows | null => {
  if (dataRaw.escrows && dataRaw.escrows.length > 0) {
    const data: IEscrows = {};
    for (let i = 0; i < dataRaw.escrows.length; i++) {
      const escrowRaw = dataRaw.escrows[i];
      data[escrowRaw.id] = getEscrow(escrowRaw, null);
    }
    return data;
  }
  return null;
};

export default escrowsByBuyerAdapter;
