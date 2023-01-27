import MyTokensDataSource from 'next-app/src/features/management/dataSource/myTokens.datasource';
import queryTokensByAccount from 'next-app/src/features/management/core/interactors/queryTokensByAccount/queryTokensByAccount';

const repository = new MyTokensDataSource();

export default queryTokensByAccount(repository);
