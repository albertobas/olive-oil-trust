import { Escrows } from '@features/shared/core/entities/Escrows';
import MyEscrowsRepository from '@features/management/core/repositories/MyEscrows.repository';
import escrowsByBuyerAdapter from '@features/management/core/adapters/escrowsByBuyer.adapter';

const queryEscrowsByBuyer =
  (repository: MyEscrowsRepository) =>
  async (buyer: string): Promise<{ error: boolean; data: Escrows | null }> => {
    try {
      const { errors, data } = await repository.getByBuyer(buyer);
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? escrowsByBuyerAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryEscrowsByBuyer;
