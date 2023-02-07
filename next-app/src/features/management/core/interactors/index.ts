import MyCertificatesDataSource from 'next-app/src/features/management/dataSource/myCertificates.datasource';
import MyEscrowsDataSource from 'next-app/src/features/management/dataSource/myEscrows.datasource';
import MyTokensDataSource from 'next-app/src/features/management/dataSource/myTokens.datasource';
import MyTokenTypesDataSource from 'next-app/src/features/management/dataSource/myTokenTypes.datasource';
import queryAllTokenTypesAndCertificates from 'next-app/src/features/management/core/interactors/queryAllTokenTypesAndCertificates';
import queryCertificatesByMemberAndAllTokenTypes from 'next-app/src/features/management/core/interactors/queryCertificatesByMemberAndAllTokenTypes';
import queryEscrowsByBuyer from 'next-app/src/features/management/core/interactors/queryEscrowsByBuyer';
import queryEscrowsByMember from 'next-app/src/features/management/core/interactors/queryEscrowsByMember';
import queryTokensAndTokenTypesByMember from 'next-app/src/features/management/core/interactors/queryTokensAndTokenTypesByMember';
import queryTokensByAccount from 'next-app/src/features/management/core/interactors/queryTokensByAccount';

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
