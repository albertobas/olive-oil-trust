import MyCertificatesDataSource from '@features/management/dataSources/myCertificates.datasource';
import MyEscrowsDataSource from '@features/management/dataSources/myEscrows.datasource';
import MyTokensDataSource from '@features/management/dataSources/myTokens.datasource';
import MyTokenTypesDataSource from '@features/management/dataSources/myTokenTypes.datasource';
import queryAllTokenTypesAndCertificates from '@features/management/core/interactors/queryAllTokenTypesAndCertificates.interactor';
import queryCertificatesByMemberAndAllTokenTypes from '@features/management/core/interactors/queryCertificatesByMemberAndAllTokenTypes.interactor';
import queryEscrowsByBuyer from '@features/management/core/interactors/queryEscrowsByBuyer.interactor';
import queryEscrowsByMember from '@features/management/core/interactors/queryEscrowsByMember.interactor';
import queryTokensAndTokenTypesByMember from '@features/management/core/interactors/queryTokensAndTokenTypesByMember.interactor';
import queryTokensByAccount from '@features/management/core/interactors/queryTokensByAccount.interactor';

const myCertificatesRepository = new MyCertificatesDataSource();
const myEscrowsRepository = new MyEscrowsDataSource();
const myTokensRepository = new MyTokensDataSource();
const myTokenTypesRepository = new MyTokenTypesDataSource();

const queryAllTokenTypesAndCertificatesWithDep = queryAllTokenTypesAndCertificates(myTokenTypesRepository);
const queryCertificatesByMemberAndAllTokenTypesWithDep =
  queryCertificatesByMemberAndAllTokenTypes(myCertificatesRepository);
const queryEscrowsByBuyerWithDep = queryEscrowsByBuyer(myEscrowsRepository);
const queryEscrowsByMemberWithDep = queryEscrowsByMember(myEscrowsRepository);
const queryTokensAndTokenTypesByMemberWithDep = queryTokensAndTokenTypesByMember(myTokensRepository);
const queryTokensByAccountWithDep = queryTokensByAccount(myTokensRepository);

export {
  queryAllTokenTypesAndCertificatesWithDep,
  queryCertificatesByMemberAndAllTokenTypesWithDep,
  queryEscrowsByBuyerWithDep,
  queryEscrowsByMemberWithDep,
  queryTokensAndTokenTypesByMemberWithDep,
  queryTokensByAccountWithDep
};
