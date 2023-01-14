import { IAllTokenTypesOOT, ITokenTypeByIdOOT } from 'next-app/src/features/explore/core/entities/TokenTypesOOT';
import { IAllTokenTypesAndCertificatesOOT } from 'next-app/src/features/management/core/entities/TokenTypesOOT';

interface TokenTypesRepository {
  getAll(endpoint: string): Promise<IAllTokenTypesOOT | undefined>;
  getAllTokenTypesAndCertificates(endpoint: string): Promise<IAllTokenTypesAndCertificatesOOT | undefined>;
  getById(endpoint: string, id: string): Promise<ITokenTypeByIdOOT | undefined>;
}

export default TokenTypesRepository;
