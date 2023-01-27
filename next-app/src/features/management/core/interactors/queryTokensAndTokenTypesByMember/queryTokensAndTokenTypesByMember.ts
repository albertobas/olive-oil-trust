import MyTokensRepository from 'next-app/src/features/management/core/repositories/MyTokens.repository';
import tokensAndTokenTypesByMemberAdapter from 'next-app/src/features/management/core/adapters/tokensAndTokenTypesByMember.adapter';
import { ITokensAndTokenTypesByMember } from 'next-app/src/features/management/core/entities/MyTokens';

const queryTokensAndTokenTypesByMember =
  (repository: MyTokensRepository) =>
  async (endpoint: string, member: string): Promise<{ error: boolean; data: ITokensAndTokenTypesByMember | null }> => {
    try {
      const rawData = await repository.getTokensAndTokenTypesByMember(endpoint, member);
      const data = tokensAndTokenTypesByMemberAdapter(rawData);
      return { error: false, data };
    } catch (e) {
      // if an error is thrown, it will be catched and true will be passed in error for our ui logic.
      console.error(e);
      return { error: true, data: null };
    }
  };

export default queryTokensAndTokenTypesByMember;
