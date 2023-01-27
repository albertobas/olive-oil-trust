import CertificatesRepository from 'next-app/src/features/explore/core/repositories/Certificates.repository';
import { GraphQLClient } from 'graphql-request';
import { CERTIFICATES_FIELDS, METADATA_FIELDS_FRAGMENT } from 'next-app/src/features/shared/utils/constants';
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
      return QUERY;
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
      return QUERY;
    };
    return client.request(getQuery(id));
  }
}
export default CertificatesDataSource;
