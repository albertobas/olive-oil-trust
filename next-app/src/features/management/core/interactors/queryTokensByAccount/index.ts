import TokensDataSource from 'next-app/src/features/shared/dataSource/tokens.datasource';
import queryTokensByAccount from 'next-app/src/features/management/core/interactors/queryTokensByAccount/queryTokensByAccount';

const repository = new TokensDataSource();

export default queryTokensByAccount(repository);
