/**
 * - CertificatesPageSSR uses getServerSideProps() to fetch data on server side.
 * - CertificatesPageCSR uses useAllCertificates() to fetch data on client side.
 * - CertificatesPageISR uses getStaticProps() to fetch data at build time and re-generates
 *   the page per request at most once every `revalidateInterval` seconds on server side.
 */

import { GetServerSideProps } from 'next';
import { getBuiltGraphSDK } from 'next-app/.graphclient';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import AllCertificates from 'next-app/src/features/explore/ui/certificates/AllCertificates';
import { brandName } from 'next-app/src/shared/utils/constants';
import allCertificatesAdapter from 'next-app/src/features/explore/core/adapters/allCertificates.adapter';
import { CertificatesState, CertificatesStateData } from 'next-app/src/features/shared/utils/interfaces';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';

function CertificatesPageSSR(state: CertificatesState): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <Intro
        title="Certificates"
        description={`In this page you can explore all the certificates that exist in ${brandName}.`}
        note="This page updates per request."
      />
      <AllCertificates {...state} />
    </>
  );
}

const sdk = getBuiltGraphSDK();

export const getServerSideProps: GetServerSideProps = async () => {
  const lastUpdated = getTime();
  try {
    const dataRaw = await sdk.AllCertificates();
    const data: CertificatesStateData = { certificates: allCertificatesAdapter(dataRaw), lastUpdated };
    return { props: { error: false, data } };
  } catch (e) {
    const data: CertificatesStateData = { certificates: null, lastUpdated };
    return { props: { error: true, data } };
  }
};

export default CertificatesPageSSR;

// import { NextPage } from 'next';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from 'next-app/src/features/shared/ui/intro/Intro';
// import { useAllCertificates } from 'next-app/src/features/explore/ui/hooks/useAllCertificates';
// import { pollInterval } from 'next-app/src/features/shared/utils/constants';
// import AllCertificates from 'next-app/src/features/explore/ui/certificates/AllCertificates';
// import { brandName } from 'next-app/src/shared/utils/constants';

// const CertificatesPageCSR: NextPage = () => {
//   const state = useAllCertificates(pollInterval);

//   return (
//     <>
//       <Breadcrumbs />
//       <Intro
//         title="Certificates"
//         description={`In this page you can explore all the certificates that exist in ${brandName}.`}
//       />
//       <AllCertificates {...state} />
//     </>
//   );
// };

// export default CertificatesPageCSR;

// import { GetStaticProps } from 'next';
// import { getBuiltGraphSDK } from 'next-app/.graphclient';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from 'next-app/src/features/shared/ui/intro/Intro';
// import AllCertificates from 'next-app/src/features/explore/ui/certificates/AllCertificates';
// import { brandName } from 'next-app/src/shared/utils/constants';
// import allCertificatesAdapter from 'next-app/src/features/explore/core/adapters/allCertificates.adapter';
// import { CertificatesState, CertificatesStateData } from 'next-app/src/features/shared/utils/interfaces';
// import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';
// import { revalidateInterval } from 'next-app/src/features/shared/utils/constants';

// function CertificatesPageISR(state: CertificatesState): JSX.Element {
//   return (
//     <>
//       <Breadcrumbs />
//       <Intro
//         title="Certificates"
//         description={`In this page you can explore all the certificates that exist in ${brandName}.`}
//         note={`Refresh the page to get an updated version at most once every ${revalidateInterval} seconds.`}
//       />
//       <AllCertificates {...state} />
//     </>
//   );
// }

// const sdk = getBuiltGraphSDK();

// export const getStaticProps: GetStaticProps = async () => {
//   const lastUpdated = getTime();
//   try {
//     const dataRaw = await sdk.AllCertificates();
//     const data: CertificatesStateData = { certificates: allCertificatesAdapter(dataRaw), lastUpdated };
//     return { props: { error: false, data }, revalidate: revalidateInterval };
//   } catch (e) {
//     const data: CertificatesStateData = { certificates: null, lastUpdated };
//     return { props: { error: true, data }, revalidate: revalidateInterval };
//   }
// };

// export default CertificatesPageISR;
