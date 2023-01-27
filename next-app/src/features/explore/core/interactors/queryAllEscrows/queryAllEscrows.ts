import { IEscrows } from 'next-app/src/features/shared/core/entities/Escrows';
import EscrowsRepository from 'next-app/src/features/explore/core/repositories/Escrows.repository';
import allEscrowsAdapter from 'next-app/src/features/explore/core/adapters/allEscrows.adapter';

const queryAllEscrows =
  (repository: EscrowsRepository) =>
  async (endpoint: string): Promise<{ error: boolean; data: IEscrows | null }> => {
    try {
      const data = await repository.getAll(endpoint);
      return { error: false, data: allEscrowsAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryAllEscrows;
