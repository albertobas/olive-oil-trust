/**
 * - DynamicCertificatePageISR uses getStaticProps() to fetch data at build time and re-generates
 *   the page per request at most once every `revalidateInterval` seconds on server side.
 * - DynamicCertificatePageSSR uses getServerSideProps() to fetch data on server side.
 * - DynamicCertificatePageCSR uses useCertificateById() to fetch data on client side.
 */

import { GetStaticProps, GetStaticPaths } from 'next';
import CertificateById from 'next-app/src/features/explore/ui/certificates/CertificateById';
import { getBuiltGraphSDK } from 'next-app/.graphclient';
import certificateByIdAdapter from 'next-app/src/features/explore/core/adapters/certificateById.adapter';
import { revalidateInterval } from 'next-app/src/features/shared/utils/constants';
import { ICertificateState } from 'next-app/src/features/shared/utils/interfaces';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';

function DynamicCertificatePageISR(props: ICertificateState & { id: string }): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <CertificateById {...props} />
    </>
  );
}

const sdk = getBuiltGraphSDK();

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params) {
    const { id } = params;
    try {
      const dataRaw = typeof id === 'string' ? await sdk.CertificateById({ id: id }) : null;
      const data = dataRaw ? certificateByIdAdapter(dataRaw) : null;
      return { props: { error: false, data, id }, revalidate: revalidateInterval };
    } catch (e) {
      return { props: { error: true, data: null, id }, revalidate: revalidateInterval };
    }
  }
  return { props: { error: true, data: null, id: '' }, revalidate: revalidateInterval };
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const dataRaw = await sdk.AllCertificates();
    const paths = dataRaw.certificates.map(({ id }) => ({ params: { id } }));
    return { paths, fallback: 'blocking' };
  } catch (e) {
    return { paths: [{ params: { id: '' } }], fallback: 'blocking' };
  }
};

export default DynamicCertificatePageISR;

// import { GetServerSideProps } from 'next';
// import CertificateById from 'next-app/src/features/explore/ui/certificates/CertificateById';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import { getBuiltGraphSDK } from 'next-app/.graphclient';
// import certificateByIdAdapter from 'next-app/src/features/explore/core/adapters/certificateById.adapter';
// import { ICertificateState } from 'next-app/src/features/shared/utils/interfaces';

// function DynamicCertificatePageSSR(props: ICertificateState & { id: string }): JSX.Element {
//   return (
//     <>
//       <Breadcrumbs />
//       <CertificateById {...props} />
//     </>
//   );
// }

// const sdk = getBuiltGraphSDK();

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const { id } = query;
//   try {
//     const dataRaw = typeof id === 'string' ? await sdk.CertificateById({ id: id }) : null;
//     const data = dataRaw ? certificateByIdAdapter(dataRaw) : null;
//     return { props: { error: false, data, id } };
//   } catch (e) {
//     return { props: { error: true, data: null, id } };
//   }
// };

// export default DynamicCertificatePageSSR;

// import { NextPage } from 'next';
// import { useRouter } from 'next/router';
// import CertificateByIdCSR from 'next-app/src/features/explore/ui/certificates/CertificateByIdCSR';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

// const DynamicCertificatePageCSR: NextPage = () => {
//   const { query, isReady } = useRouter();
//   const { id } = query;

//   return (
//     <>
//       <Breadcrumbs />
//       {isReady ? (
//         typeof id === 'string' ? (
//           <CertificateByIdCSR id={id} />
//         ) : (
//           <FallbackMessage message="Unable to retrieve the certificate id." error />
//         )
//       ) : (
//         <FallbackMessage />
//       )}
//     </>
//   );
// };

// export default DynamicCertificatePageCSR;
