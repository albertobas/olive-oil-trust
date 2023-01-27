import { IAllTokensOOT, ITokenByIdOOT } from 'next-app/src/features/explore/core/entities/TokensOOT';

interface TokensRepository {
  getById(endpoint: string, id: string): Promise<ITokenByIdOOT | undefined>;
  getAll(endpoint: string): Promise<IAllTokensOOT | undefined>;
}

export default TokensRepository;
