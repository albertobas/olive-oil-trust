import { AllTokenTypesAndCertificatesQuery } from '.graphclient';
import { ExecutionResult } from 'graphql';

interface MyTokenTypesRepository {
  getAllTokenTypesAndCertificates(): Promise<ExecutionResult<AllTokenTypesAndCertificatesQuery>>;
}

export default MyTokenTypesRepository;
