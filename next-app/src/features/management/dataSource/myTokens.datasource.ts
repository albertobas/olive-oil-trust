import { gql, GraphQLClient } from 'graphql-request';
import {
  ITokensAndTokenTypesByMemberOOT,
  ITokensByAccountOOT
} from 'next-app/src/features/management/core/entities/MyTokensOOT';
import {
  TOKEN_TYPE_FIELDS,
  METADATA_FIELDS_FRAGMENT,
  TOKEN_FIELDS,
  TOKEN_FIELDS_FRAGMENT
} from 'next-app/src/features/shared/utils/constants';
import MyTokensRepository from 'next-app/src/features/management/core/repositories/MyTokens.repository';

class MyTokensDataSource implements MyTokensRepository {
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
export default MyTokensDataSource;
