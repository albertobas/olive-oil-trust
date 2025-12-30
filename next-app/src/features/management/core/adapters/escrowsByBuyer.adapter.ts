import { Escrows } from '@features/shared/core/entities/Escrows';
import { getEscrow } from '@features/shared/utils/helpers/escrow';
import { EscrowsByBuyerQuery } from '.graphclient';

const escrowsByBuyerAdapter = (dataRaw: EscrowsByBuyerQuery): Escrows | null => {
  if (dataRaw.escrows && dataRaw.escrows.length > 0) {
    const data: Escrows = {};
    for (let i = 0; i < dataRaw.escrows.length; i++) {
      const escrowRaw = dataRaw.escrows[i];
      data[escrowRaw.id] = getEscrow(escrowRaw, null);
    }
    return data;
  }
  return null;
};

export default escrowsByBuyerAdapter;
