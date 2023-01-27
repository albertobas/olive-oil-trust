import EscrowsDataSource from 'next-app/src/features/explore/dataSource/escrows.datasource';
import queryAllEscrows from 'next-app/src/features/explore/core/interactors/queryAllEscrows/queryAllEscrows';

const repository = new EscrowsDataSource();

export default queryAllEscrows(repository);
