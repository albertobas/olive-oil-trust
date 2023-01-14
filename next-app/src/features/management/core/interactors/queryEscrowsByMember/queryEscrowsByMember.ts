import { IEscrows } from 'next-app/src/features/shared/core/entities/Escrows';
import EscrowsRepository from 'next-app/src/features/shared/core/repositories/Escrows.repository';
import escrowsByMemberAdapter from 'next-app/src/features/management/core/adapters/escrowsByMember.adapter';

const queryEscrowsByMember =
  (repository: EscrowsRepository) =>
  async (endpoint: string, member: string): Promise<{ error: boolean; data: IEscrows | null }> => {
    try {
      const data = await repository.getByMember(endpoint, member);
      return { error: false, data: escrowsByMemberAdapter(data) };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryEscrowsByMember;
