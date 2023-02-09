import MyTokenTypesRepository from 'next-app/src/features/management/core/repositories/MyTokenTypes.repository';
import {
  execute,
  AllTokenTypesAndCertificatesDocument,
  AllTokenTypesAndCertificatesQuery
} from 'next-app/.graphclient';
import { ExecutionResult } from 'graphql';

class MyTokenTypesDataSource implements MyTokenTypesRepository {
  public async getAllTokenTypesAndCertificates(): Promise<ExecutionResult<AllTokenTypesAndCertificatesQuery>> {
    return execute(AllTokenTypesAndCertificatesDocument, {});
  }
}

export default MyTokenTypesDataSource;
