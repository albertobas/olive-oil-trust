import MyCertificatesDataSource from 'next-app/src/features/management/dataSource/myCertificates.datasource';
import queryCertificatesByMemberAndAllTokenTypes from 'next-app/src/features/management/core/interactors/queryCertificatesByMemberAndAllTokenTypes/queryCertificatesByMemberAndAllTokenTypes';

const repository = new MyCertificatesDataSource();

export default queryCertificatesByMemberAndAllTokenTypes(repository);
