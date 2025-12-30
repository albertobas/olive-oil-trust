import CertifiatesDataSource from '@features/explore/dataSources/certificates.datasource';
import EscrowsDataSource from '@features/explore/dataSources/escrows.datasource';
import TokensDataSource from '@features/explore/dataSources/tokens.datasource';
import TokenTypesDataSource from '@features/explore/dataSources/tokenTypes.datasource';
import queryAllCertificates from '@features/explore/core/interactors/queryAllCertificates.interactor';
import queryAllEscrows from '@features/explore/core/interactors/queryAllEscrows.interactor';
import queryAllTokens from '@features/explore/core/interactors/queryAllTokens.interactor';
import queryAllTokenTypes from '@features/explore/core/interactors/queryAllTokenTypes.interactor';
import queryCertificateById from '@features/explore/core/interactors/queryCertificateById.interactor';
import queryTokenById from '@features/explore/core/interactors/queryTokenById.interactor';
import queryTokenTypeById from '@features/explore/core/interactors/queryTokenTypeById.interactor';

const certificatesRepository = new CertifiatesDataSource();
const escrowsRepository = new EscrowsDataSource();
const tokensRepository = new TokensDataSource();
const tokenTypesRepository = new TokenTypesDataSource();

const queryAllCertificatesWithDep = queryAllCertificates(certificatesRepository);
const queryAllEscrowsWithDep = queryAllEscrows(escrowsRepository);
const queryAllTokensWithDep = queryAllTokens(tokensRepository);
const queryAllTokenTypesWithDep = queryAllTokenTypes(tokenTypesRepository);
const queryCertificateByIdWithDep = queryCertificateById(certificatesRepository);
const queryTokenByIdWithDep = queryTokenById(tokensRepository);
const queryTokenTypeByIdWithDep = queryTokenTypeById(tokenTypesRepository);

export {
  queryAllCertificatesWithDep,
  queryAllEscrowsWithDep,
  queryAllTokensWithDep,
  queryAllTokenTypesWithDep,
  queryCertificateByIdWithDep,
  queryTokenByIdWithDep,
  queryTokenTypeByIdWithDep
};
