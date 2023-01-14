import TokenTypesDataSource from 'next-app/src/features/shared/dataSource/tokenTypes.datasource';
import queryAllTokenTypes from 'next-app/src/features/explore/core/interactors/queryAllTokenTypes/queryAllTokenTypes';

const repository = new TokenTypesDataSource();

export default queryAllTokenTypes(repository);
