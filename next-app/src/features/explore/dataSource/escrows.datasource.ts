import { GraphQLClient } from 'graphql-request';
import { ESCROW_FIELDS, METADATA_FIELDS_FRAGMENT } from 'next-app/src/features/shared/utils/constants';
import { IAllEscrowsOOT } from 'next-app/src/features/explore/core/entities/EscrowsOOT';
import EscrowsRepository from 'next-app/src/features/explore/core/repositories/Escrows.repository';

class EscrowsDataSource implements EscrowsRepository {
  public async getAll(endpoint: string): Promise<IAllEscrowsOOT | undefined> {
    const client = new GraphQLClient(endpoint);
    const getQuery = () => {
      const QUERY = `query AllEscrows {
                        escrows {
                          ${ESCROW_FIELDS}
                        }
                      }

                      ${METADATA_FIELDS_FRAGMENT}`;
      return QUERY;
    };
    return client.request(getQuery());
  }
}
export default EscrowsDataSource;
