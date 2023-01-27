import TokenTypesRepository from 'next-app/src/features/explore/core/repositories/TokenTypes.repository';
import { GraphQLClient } from 'graphql-request';
import { IAllTokenTypesOOT, ITokenTypeByIdOOT } from 'next-app/src/features/explore/core/entities/TokenTypesOOT';
import { METADATA_FIELDS_FRAGMENT, TOKEN_TYPE_FIELDS } from 'next-app/src/features/shared/utils/constants';

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
      return QUERY;
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
      return QUERY;
    };
    return client.request(getQuery(id));
  }
}

export default TokenTypesDataSource;
