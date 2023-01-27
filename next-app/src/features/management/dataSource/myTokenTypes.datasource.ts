import MyTokenTypesRepository from 'next-app/src/features/management/core/repositories/MyTokenTypes.repository';
import { gql, GraphQLClient } from 'graphql-request';
import { IAllTokenTypesAndCertificatesOOT } from 'next-app/src/features/management/core/entities/MyTokenTypesOOT';
import {
  CERTIFICATES_FIELDS,
  METADATA_FIELDS_FRAGMENT,
  TOKEN_TYPE_FIELDS
} from 'next-app/src/features/shared/utils/constants';

class MyTokenTypesDataSource implements MyTokenTypesRepository {
  public async getAllTokenTypesAndCertificates(
    endpoint: string
  ): Promise<IAllTokenTypesAndCertificatesOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = () => {
      const QUERY = `query AllTokenTypesAndCertificates {
                                              tokenTypes {
                                                ${TOKEN_TYPE_FIELDS}
                                              }
                                              certificates {
                                                ${CERTIFICATES_FIELDS}
                                              }
                                            }
                                            ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    };
    return client.request(getQuery());
  }
}

export default MyTokenTypesDataSource;
