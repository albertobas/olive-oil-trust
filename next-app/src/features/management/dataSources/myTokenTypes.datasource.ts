import MyTokenTypesRepository from '@features/management/core/repositories/MyTokenTypes.repository';
import { execute, AllTokenTypesAndCertificatesDocument, AllTokenTypesAndCertificatesQuery } from '.graphclient';
import { ExecutionResult } from 'graphql';

class MyTokenTypesDataSource implements MyTokenTypesRepository {
  public async getAllTokenTypesAndCertificates(): Promise<ExecutionResult<AllTokenTypesAndCertificatesQuery>> {
    return execute(AllTokenTypesAndCertificatesDocument, {});
  }
}

export default MyTokenTypesDataSource;
