import EscrowsDataSource from 'next-app/src/features/shared/dataSource/escrows.datasource';
import queryEscrowsByBuyer from 'next-app/src/features/management/core/interactors/queryEscrowsByBuyer/queryEscrowsByBuyer';

const repository = new EscrowsDataSource();

export default queryEscrowsByBuyer(repository);
