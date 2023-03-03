import MyTokensRepository from 'next-app/src/features/management/core/repositories/MyTokens.repository';
import tokensAndTokenTypesByMemberAdapter from 'next-app/src/features/management/core/adapters/tokensAndTokenTypesByMember.adapter';
import { TokensAndTokenTypesByMember } from 'next-app/src/features/management/core/entities/MyTokens';

const queryTokensAndTokenTypesByMember =
  (repository: MyTokensRepository) =>
  async (member: string): Promise<{ error: boolean; data: TokensAndTokenTypesByMember | null }> => {
    try {
      const { errors, data } = await repository.getTokensAndTokenTypesByMember(member);
      if (errors) {
        throw errors;
      }
      return { error: false, data: data ? tokensAndTokenTypesByMemberAdapter(data) : null };
    } catch (e) {
      if (Array.isArray(e)) {
        e.forEach((error) => console.error(error));
      } else {
        console.error(e);
      }
      return { error: true, data: null };
    }
  };

export default queryTokensAndTokenTypesByMember;
