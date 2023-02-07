import { useAllCertificates } from 'next-app/src/features/explore/ui/hooks/useAllCertificates';
import { pollInterval } from 'next-app/src/features/shared/utils/constants';
import AllCertificates from 'next-app/src/features/explore/ui/certificates/AllCertificates';

const AllCertificatesCSR = (): JSX.Element => {
  const state = useAllCertificates(pollInterval);

  return <AllCertificates {...state} />;
};

export default AllCertificatesCSR;
