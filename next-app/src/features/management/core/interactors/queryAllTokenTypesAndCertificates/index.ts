import TokenTypesDataSource from 'next-app/src/features/shared/dataSource/tokenTypes.datasource';
import queryAllTokenTypesAndCertificates from 'next-app/src/features/management/core/interactors/queryAllTokenTypesAndCertificates/queryAllTokenTypesAndCertificates';

const repository = new TokenTypesDataSource();

export default queryAllTokenTypesAndCertificates(repository);
