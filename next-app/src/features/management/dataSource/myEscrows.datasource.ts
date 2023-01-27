import { gql, GraphQLClient } from 'graphql-request';
import { ESCROW_FIELDS, METADATA_FIELDS_FRAGMENT } from 'next-app/src/features/shared/utils/constants';
import {
  IEscrowsByAccountOOT,
  IEscrowsByBuyerOOT,
  IEscrowsByMemberOOT
} from 'next-app/src/features/management/core/entities/MyEscrowsOOT';
import MyEscrowsRepository from 'next-app/src/features/management/core/repositories/MyEscrows.repository';

class MyEscrowsDataSource implements MyEscrowsRepository {
  public async getByAccount(endpoint: string, account: string): Promise<IEscrowsByAccountOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = (account: string) => {
      const QUERY = `query EscrowsByAccount {
                        account(id: "${account.toString()}") {
                          asEscrowContract {
                            id
                            escrows{
                              ${ESCROW_FIELDS}
                            }
                          }
                        }
                      }

                      ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    };
    return client.request(getQuery(account));
  }

  public async getByBuyer(endpoint: string, member: string): Promise<IEscrowsByBuyerOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = (member: string) => {
      const QUERY = `query EscrowsByBuyer {
                        escrows(where: {buyer: "${member.toString()}"}) {
                            ${ESCROW_FIELDS}
                        }
                      }

                      ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    };
    return client.request(getQuery(member));
  }

  public async getByMember(endpoint: string, member: string): Promise<IEscrowsByMemberOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = (member: string) => {
      const QUERY = `query EscrowsByMember {
                        memberContract(id: "${member.toString()}") {
                          id
                          name
                          role
                          asAccount {
                            ownerOfEscrowContract {
                              id
                              escrows{
                                ${ESCROW_FIELDS}
                              }
                            }
                          }
                        }
                      }

                      ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    };
    return client.request(getQuery(member));
  }
}
export default MyEscrowsDataSource;
