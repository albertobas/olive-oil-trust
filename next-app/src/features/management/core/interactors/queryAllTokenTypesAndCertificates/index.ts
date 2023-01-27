import MyTokenTypesDataSource from 'next-app/src/features/management/dataSource/myTokenTypes.datasource';
import queryAllTokenTypesAndCertificates from 'next-app/src/features/management/core/interactors/queryAllTokenTypesAndCertificates/queryAllTokenTypesAndCertificates';

const repository = new MyTokenTypesDataSource();

export default queryAllTokenTypesAndCertificates(repository);
