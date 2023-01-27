import { IAllTokenTypesOOT, ITokenTypeByIdOOT } from 'next-app/src/features/explore/core/entities/TokenTypesOOT';

interface TokenTypesRepository {
  getAll(endpoint: string): Promise<IAllTokenTypesOOT | undefined>;
  getById(endpoint: string, id: string): Promise<ITokenTypeByIdOOT | undefined>;
}

export default TokenTypesRepository;
