import CertificatesRepository from 'next-app/src/features/shared/core/repositories/Certificates.repository';
import { gql, GraphQLClient } from 'graphql-request';
import {
  CERTIFICATES_FIELDS,
  TOKEN_TYPE_FIELDS,
  METADATA_FIELDS_FRAGMENT
} from 'next-app/src/features/shared/utils/constants';
import { ICertificatesAndTokenTypesByMemberOOT } from 'next-app/src/features/management/core/entities/CertificatesOOT';
import { IAllCertificatesOOT, ICertificateByIdOOT } from 'next-app/src/features/explore/core/entities/CertificatesOOT';

class CertificatesDataSource implements CertificatesRepository {
  public async getAll(endpoint: string): Promise<IAllCertificatesOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = () => {
      const QUERY = `query AllCertificates {
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

  public async getById(endpoint: string, id: string): Promise<ICertificateByIdOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = (id: string) => {
      const QUERY = `query CertificateById {
                      certificate(id: "${id}") {
                        ${CERTIFICATES_FIELDS}
                      }
                    }
                    ${METADATA_FIELDS_FRAGMENT}`;
      return gql`
        ${QUERY}
      `;
    };
    return client.request(getQuery(id));
  }

  public async getByMember(
    endpoint: string,
    member: string
  ): Promise<ICertificatesAndTokenTypesByMemberOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = () => {
      const QUERY = `query CertificatesByMember {
                      memberContract(id: "${member.toString()}") {
                        id
                        name
                        role
                        asAccount {
                          ownerOfCertificateContract {
                            id
                            certificates {
                              ${CERTIFICATES_FIELDS}
                            }
                          }
                        }
                      }

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
}
export default CertificatesDataSource;
