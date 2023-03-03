import { Escrows } from 'next-app/src/features/shared/core/entities/Escrows';
import MyEscrowsRepository from 'next-app/src/features/management/core/repositories/MyEscrows.repository';
import escrowsByMemberAdapter from 'next-app/src/features/management/core/adapters/escrowsByMember.adapter';

const queryEscrowsByMember =
  (repository: MyEscrowsRepository) =>
  async (member: string): Promise<{ error: boolean; data: Escrows | null }> => {
    try {
      const { errors, data } = await repository.getByMember(member);
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? escrowsByMemberAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryEscrowsByMember;
