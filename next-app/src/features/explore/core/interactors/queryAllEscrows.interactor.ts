import { Escrows } from 'next-app/src/features/shared/core/entities/Escrows';
import EscrowsRepository from 'next-app/src/features/explore/core/repositories/Escrows.repository';
import allEscrowsAdapter from 'next-app/src/features/explore/core/adapters/allEscrows.adapter';

const queryAllEscrows =
  (repository: EscrowsRepository) => async (): Promise<{ error: boolean; data: Escrows | null }> => {
    try {
      const { errors, data } = await repository.getAll();
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? allEscrowsAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryAllEscrows;
