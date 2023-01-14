import EscrowsDataSource from 'next-app/src/features/shared/dataSource/escrows.datasource';
import queryEscrowsByMember from 'next-app/src/features/management/core/interactors/queryEscrowsByMember/queryEscrowsByMember';

const repository = new EscrowsDataSource();

export default queryEscrowsByMember(repository);
