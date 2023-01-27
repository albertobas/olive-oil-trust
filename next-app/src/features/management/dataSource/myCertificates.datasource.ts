import MyCertificatesRepository from 'next-app/src/features/management/core/repositories/MyCertificates.repository';
import { gql, GraphQLClient } from 'graphql-request';
import {
  CERTIFICATES_FIELDS,
  TOKEN_TYPE_FIELDS,
  METADATA_FIELDS_FRAGMENT
} from 'next-app/src/features/shared/utils/constants';
import { ICertificatesAndTokenTypesByMemberOOT } from 'next-app/src/features/management/core/entities/MyCertificatesOOT';

class MyCertificatesDataSource implements MyCertificatesRepository {
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
export default MyCertificatesDataSource;
