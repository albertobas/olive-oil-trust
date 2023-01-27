import MyTokensDataSource from 'next-app/src/features/management/dataSource/myTokens.datasource';
import queryTokensAndTokenTypesByMember from 'next-app/src/features/management/core/interactors/queryTokensAndTokenTypesByMember/queryTokensAndTokenTypesByMember';

const repository = new MyTokensDataSource();

export default queryTokensAndTokenTypesByMember(repository);
