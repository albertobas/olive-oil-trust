import CertifiatesDataSource from 'next-app/src/features/shared/dataSource/certificates.datasource';
import queryAllCertificates from 'next-app/src/features/explore/core/interactors/queryAllCertificates/queryAllCertificates';

const repository = new CertifiatesDataSource();

export default queryAllCertificates(repository);
