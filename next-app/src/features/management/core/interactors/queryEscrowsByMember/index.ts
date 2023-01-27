import MyEscrowsDataSource from 'next-app/src/features/management/dataSource/myEscrows.datasource';
import queryEscrowsByMember from 'next-app/src/features/management/core/interactors/queryEscrowsByMember/queryEscrowsByMember';

const repository = new MyEscrowsDataSource();

export default queryEscrowsByMember(repository);
