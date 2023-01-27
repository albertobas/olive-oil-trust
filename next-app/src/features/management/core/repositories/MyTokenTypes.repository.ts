import { IAllTokenTypesAndCertificatesOOT } from 'next-app/src/features/management/core/entities/MyTokenTypesOOT';

interface MyTokenTypesRepository {
  getAllTokenTypesAndCertificates(endpoint: string): Promise<IAllTokenTypesAndCertificatesOOT | undefined>;
}

export default MyTokenTypesRepository;
