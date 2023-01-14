import { gql, GraphQLClient } from 'graphql-request';
import { IAllTokensOOT, ITokenByIdOOT } from 'next-app/src/features/explore/core/entities/TokensOOT';
import {
  ITokensAndTokenTypesByMemberOOT,
  ITokensByAccountOOT
} from 'next-app/src/features/management/core/entities/TokensOOT';
import {
  TOKEN_TYPE_FIELDS,
  METADATA_FIELDS_FRAGMENT,
  TOKEN_FIELDS,
  TOKEN_FIELDS_FRAGMENT
} from 'next-app/src/features/shared/utils/constants';
import TokensRepository from 'next-app/src/features/shared/core/repositories/Tokens.repository';

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

  public async getTokensAndTokenTypesByMember(
    endpoint: string,
    member: string
  ): Promise<ITokensAndTokenTypesByMemberOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    function getQuery(member: string) {
      const QUERY = `query TokensAndTokenTypesByMember {
                        memberContract(id: "${member.toString()}") {
                          id
                          name
                          role
                          asAccount {
                            tokenBalances {
                              valueExact
                              tokenToken {
                                ${TOKEN_FIELDS}
                              }
                            }
                            ownerOfTokenContract {
                              tokens {
                                id
                              }
                              tokenTypes {
                                ${TOKEN_TYPE_FIELDS}
                              }
                            }
                          }
                        }
                      }
                      ${TOKEN_FIELDS_FRAGMENT}
                      ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    }
    return client.request(getQuery(member));
  }

  public async getTokensByAccount(endpoint: string, account: string): Promise<ITokensByAccountOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    function getQuery(account: string) {
      const QUERY = `query TokensByAccount {
                        account (id: "${account.toString()}") {
                          tokenBalances {
                            valueExact
                            tokenToken {
                              ${TOKEN_FIELDS}
                            }
                          }
                        }
                      }
                      ${TOKEN_FIELDS_FRAGMENT}
                      ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    }
    return client.request(getQuery(account));
  }
}
export default TokensDataSource;
