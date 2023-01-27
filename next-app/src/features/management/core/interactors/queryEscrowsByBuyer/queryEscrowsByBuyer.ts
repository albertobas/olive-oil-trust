import { IEscrows } from 'next-app/src/features/shared/core/entities/Escrows';
import MyEscrowsRepository from 'next-app/src/features/management/core/repositories/MyEscrows.repository';
import escrowsByBuyerAdapter from 'next-app/src/features/management/core/adapters/escrowsByBuyer.adapter';

const queryEscrowsByBuyer =
  (repository: MyEscrowsRepository) =>
  async (endpoint: string, buyer: string): Promise<{ error: boolean; data: IEscrows | null }> => {
    try {
      const data = await repository.getByBuyer(endpoint, buyer);
      return { error: false, data: escrowsByBuyerAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryEscrowsByBuyer;
