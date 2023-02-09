import CertifiatesDataSource from 'next-app/src/features/explore/dataSources/certificates.datasource';
import EscrowsDataSource from 'next-app/src/features/explore/dataSources/escrows.datasource';
import TokensDataSource from 'next-app/src/features/explore/dataSources/tokens.datasource';
import TokenTypesDataSource from 'next-app/src/features/explore/dataSources/tokenTypes.datasource';
import queryAllCertificates from 'next-app/src/features/explore/core/interactors/queryAllCertificates';
import queryAllEscrows from 'next-app/src/features/explore/core/interactors/queryAllEscrows';
import queryAllTokens from 'next-app/src/features/explore/core/interactors/queryAllTokens';
import queryAllTokenTypes from 'next-app/src/features/explore/core/interactors/queryAllTokenTypes';
import queryCertificateById from 'next-app/src/features/explore/core/interactors/queryCertificateById';
import queryTokenById from 'next-app/src/features/explore/core/interactors/queryTokenById';
import queryTokenTypeById from 'next-app/src/features/explore/core/interactors/queryTokenTypeById';

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
