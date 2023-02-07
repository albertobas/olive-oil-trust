/**
 * - EscrowsPageSSR uses getServerSideProps() to fetch data on server side.
 * - EscrowsPageCSR uses useAllEscrows() to fetch data on client side.
 * - EscrowsPageISR uses getStaticProps() to fetch data at build time and re-generates
 *   the page per request at most once every `revalidateInterval` seconds on server side.
 */

import { GetServerSideProps } from 'next';
import { getBuiltGraphSDK } from 'next-app/.graphclient';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import AllEscrows from 'next-app/src/features/explore/ui/escrows/AllEscrows';
import { brandName } from 'next-app/src/shared/utils/constants';
import allEscrowsAdapter from 'next-app/src/features/explore/core/adapters/allEscrows.adapter';
import { IEscrowsState, IEscrowsStateData } from 'next-app/src/features/shared/utils/interfaces';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';

function EscrowsPageSSR(state: IEscrowsState): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <Intro
        title="Escrows"
        description={`In this page you can explore all the escrows that exist in ${brandName}.`}
        note="This page updates per request."
      />
      <AllEscrows {...state} />
    </>
  );
}

const sdk = getBuiltGraphSDK();

export const getServerSideProps: GetServerSideProps = async () => {
  const lastUpdated = getTime();
  try {
    const dataRaw = await sdk.AllEscrows();
    const data: IEscrowsStateData = { escrows: allEscrowsAdapter(dataRaw), lastUpdated };
    return { props: { error: false, data } };
  } catch (e) {
    const data: IEscrowsStateData = { escrows: null, lastUpdated };
    return { props: { error: true, data } };
  }
};

export default EscrowsPageSSR;

// import { NextPage } from 'next';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from 'next-app/src/features/shared/ui/intro/Intro';
// import AllEscrowsCSR from 'next-app/src/features/explore/ui/escrows/AllEscrowsCSR';
// import { brandName } from 'next-app/src/shared/utils/constants';

// const EscrowsPageCSR: NextPage = () => {
//   return (
//     <>
//       <Breadcrumbs />
//       <Intro title="Escrows" description={`In this page you can explore all the escrows that exist in ${brandName}.`} />
//       <AllEscrowsCSR />
//     </>
//   );
// };

// export default EscrowsPageCSR;

// import { GetStaticProps } from 'next';
// import { getBuiltGraphSDK } from 'next-app/.graphclient';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from 'next-app/src/features/shared/ui/intro/Intro';
// import AllEscrows from 'next-app/src/features/explore/ui/escrows/AllEscrows';
// import { brandName } from 'next-app/src/shared/utils/constants';
// import allEscrowsAdapter from 'next-app/src/features/explore/core/adapters/allEscrows.adapter';
// import { IEscrowsState, IEscrowsStateData } from 'next-app/src/features/shared/utils/interfaces';
// import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';
// import { revalidateInterval } from 'next-app/src/features/shared/utils/constants';

// function EscrowsPageISR(state: IEscrowsState): JSX.Element {
//   return (
//     <>
//       <Breadcrumbs />
//       <Intro
//         title="Escrows"
//         description={`In this page you can explore all the escrows that exist in ${brandName}.`}
//         note={`Refresh the page to get an updated version at most once every ${revalidateInterval} seconds.`}
//       />
//       <AllEscrows {...state} />
//     </>
//   );
// }

// const sdk = getBuiltGraphSDK();

// export const getStaticProps: GetStaticProps = async () => {
//   const lastUpdated = getTime();
//   try {
//     const dataRaw = await sdk.AllEscrows();
//     const data: IEscrowsStateData = { escrows: allEscrowsAdapter(dataRaw), lastUpdated };
//     return { props: { error: false, data }, revalidate: revalidateInterval };
//   } catch (e) {
//     const data: IEscrowsStateData = { escrows: null, lastUpdated };
//     return { props: { error: true, data }, revalidate: revalidateInterval };
//   }
// };

// export default EscrowsPageISR;
