import TokensDataSource from 'next-app/src/features/shared/dataSource/tokens.datasource';
import queryTokensAndTokenTypesByMember from 'next-app/src/features/management/core/interactors/queryTokensAndTokenTypesByMember/queryTokensAndTokenTypesByMember';

const repository = new TokensDataSource();

export default queryTokensAndTokenTypesByMember(repository);
