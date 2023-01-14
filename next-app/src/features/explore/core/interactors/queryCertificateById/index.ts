import CertificatesDataSource from 'next-app/src/features/shared/dataSource/certificates.datasource';
import queryCertificateById from 'next-app/src/features/explore/core/interactors/queryCertificateById/queryCertificateById';

const repository = new CertificatesDataSource();

export default queryCertificateById(repository);
