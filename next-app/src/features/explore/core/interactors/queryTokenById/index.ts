import TokensDataSource from 'next-app/src/features/shared/dataSource/tokens.datasource';
import queryTokenById from 'next-app/src/features/explore/core/interactors/queryTokenById/queryTokenById';

const repository = new TokensDataSource();

export default queryTokenById(repository);
