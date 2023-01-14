import TokenTypesDataSource from 'next-app/src/features/shared/dataSource/tokenTypes.datasource';
import queryTokenTypeById from 'next-app/src/features/explore/core/interactors/queryTokenTypeById/queryTokenTypeById';

const repository = new TokenTypesDataSource();

export default queryTokenTypeById(repository);
