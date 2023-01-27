import TokensDataSource from 'next-app/src/features/explore/dataSource/tokens.datasource';
import queryAllTokens from 'next-app/src/features/explore/core/interactors/queryAllTokens/queryAllTokens';

const repository = new TokensDataSource();

export default queryAllTokens(repository);
