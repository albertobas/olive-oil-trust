import MyEscrowsDataSource from 'next-app/src/features/management/dataSource/myEscrows.datasource';
import queryEscrowsByBuyer from 'next-app/src/features/management/core/interactors/queryEscrowsByBuyer/queryEscrowsByBuyer';

const repository = new MyEscrowsDataSource();

export default queryEscrowsByBuyer(repository);
