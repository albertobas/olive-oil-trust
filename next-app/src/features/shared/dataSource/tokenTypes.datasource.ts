import TokenTypesRepository from 'next-app/src/features/shared/core/repositories/TokenTypes.repository';
import { gql, GraphQLClient } from 'graphql-request';
import { IAllTokenTypesAndCertificatesOOT } from 'next-app/src/features/management/core/entities/TokenTypesOOT';
import { IAllTokenTypesOOT, ITokenTypeByIdOOT } from 'next-app/src/features/explore/core/entities/TokenTypesOOT';
import {
  CERTIFICATES_FIELDS,
  METADATA_FIELDS_FRAGMENT,
  TOKEN_TYPE_FIELDS
} from 'next-app/src/features/shared/utils/constants';

class TokenTypesDataSource implements TokenTypesRepository {
  public async getAll(endpoint: string): Promise<IAllTokenTypesOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = () => {
      const QUERY = `query AllTokenTypes {
                              tokenTypes {
                                ${TOKEN_TYPE_FIELDS}
                              }
                            }
                            ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    };
    return client.request(getQuery());
  }

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

  public async getById(endpoint: string, id: string): Promise<ITokenTypeByIdOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = (id: string) => {
      const QUERY = `query TokenTypeById {
                            tokenType(id: "${id}") {
                              ${TOKEN_TYPE_FIELDS}
                            }
                          }
                          ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    };
    return client.request(getQuery(id));
  }
}

export default TokenTypesDataSource;
