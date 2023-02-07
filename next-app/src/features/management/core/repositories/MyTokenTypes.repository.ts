import { AllTokenTypesAndCertificatesQuery } from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

interface MyTokenTypesRepository {
  getAllTokenTypesAndCertificates(): Promise<ExecutionResult<AllTokenTypesAndCertificatesQuery>>;
}

export default MyTokenTypesRepository;
