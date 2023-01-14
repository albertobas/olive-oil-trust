import CertificatesDataSource from 'next-app/src/features/shared/dataSource/certificates.datasource';
import queryCertificatesByMemberAndAllTokenTypes from 'next-app/src/features/management/core/interactors/queryCertificatesByMemberAndAllTokenTypes/queryCertificatesByMemberAndAllTokenTypes';

const repository = new CertificatesDataSource();

export default queryCertificatesByMemberAndAllTokenTypes(repository);
