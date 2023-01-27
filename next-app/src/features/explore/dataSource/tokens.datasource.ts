import { gql, GraphQLClient } from 'graphql-request';
import { IAllTokensOOT, ITokenByIdOOT } from 'next-app/src/features/explore/core/entities/TokensOOT';
import {
  METADATA_FIELDS_FRAGMENT,
  TOKEN_FIELDS,
  TOKEN_FIELDS_FRAGMENT
} from 'next-app/src/features/shared/utils/constants';
import TokensRepository from 'next-app/src/features/explore/core/repositories/Tokens.repository';

class TokensDataSource implements TokensRepository {
  public async getAll(endpoint: string): Promise<IAllTokensOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    function getQuery() {
      const QUERY = `query AllTokens {
                        tokens {
                          ${TOKEN_FIELDS}
                        }
                      }
                      ${TOKEN_FIELDS_FRAGMENT}
                      ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    }
    return client.request(getQuery());
  }

  public async getById(endpoint: string, id: string): Promise<ITokenByIdOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    function getQuery(id: string) {
      const QUERY = `query TokenById {
                        token(id: "${id}") {
                          ${TOKEN_FIELDS}
                        }
                      }
                      ${TOKEN_FIELDS_FRAGMENT}
                      ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    }
    return client.request(getQuery(id));
  }
}
export default TokensDataSource;
