/**
 * - TokenTypesPageSSR uses getServerSideProps() to fetch data on server side.
 * - TokenTypesPageCSR uses useAllTokenTypes() to fetch data on client side.
 * - TokenTypesPageISR uses getStaticProps() to fetch data at build time and re-generates
 *   the page per request at most once every `revalidateInterval` seconds on server side.
 */

import { GetServerSideProps } from 'next';
import { getBuiltGraphSDK } from '.graphclient';
import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from '@features/shared/ui/intro/Intro';
import AllTokenTypes from '@features/explore/ui/tokenTypes/AllTokenTypes';
import { brandName } from '@shared/utils/constants';
import allTokenTypesAdapter from '@features/explore/core/adapters/allTokenTypes.adapter';
import { TokenTypesState, TokenTypesStateData } from '@features/shared/utils/interfaces';
import { getTime } from '@features/shared/utils/helpers/helpers';

function TokenTypesPageSSR(state: TokenTypesState): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <Intro
        title="Token Types"
        description={`In this page you can explore all the types of tokens that exist in ${brandName}.`}
        note="This page updates per request."
      />
      <AllTokenTypes {...state} />
    </>
  );
}

const sdk = getBuiltGraphSDK();

export const getServerSideProps: GetServerSideProps = async () => {
  const lastUpdated = getTime();
  try {
    const dataRaw = await sdk.AllTokenTypes();
    const data: TokenTypesStateData = { tokenTypes: allTokenTypesAdapter(dataRaw), lastUpdated };
    return { props: { error: false, data } };
  } catch (e) {
    const data: TokenTypesStateData = { tokenTypes: null, lastUpdated };
    return { props: { error: true, data } };
  }
};
export default TokenTypesPageSSR;

// import { NextPage } from 'next';
// import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from '@features/shared/ui/intro/Intro';
// import { useAllTokenTypes } from '@features/explore/ui/hooks/useAllTokenTypes';
// import { pollInterval } from '@features/shared/utils/constants';
// import AllTokenTypes from '@features/explore/ui/tokenTypes/AllTokenTypes';
// import { brandName } from '@shared/utils/constants';

// const TokenTypesPageCSR: NextPage = () => {
//   const state = useAllTokenTypes(pollInterval);

//   return (
//     <>
//       <Breadcrumbs />
//       <Intro
//         title="Token Types"
//         description={`In this page you can explore all the types of tokens that exist in ${brandName}.`}
//       />
//       <AllTokenTypes {...state} />
//     </>
//   );
// };

// export default TokenTypesPageCSR;

// import { GetStaticProps } from 'next';
// import { getBuiltGraphSDK } from '.graphclient';
// import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from '@features/shared/ui/intro/Intro';
// import AllTokenTypes from '@features/explore/ui/tokenTypes/AllTokenTypes';
// import { brandName } from '@shared/utils/constants';
// import allTokenTypesAdapter from '@features/explore/core/adapters/allTokenTypes.adapter';
// import { TokenTypesState, TokenTypesStateData } from '@features/shared/utils/interfaces';
// import { getTime } from '@features/shared/utils/helpers/helpers';
// import { revalidateInterval } from '@features/shared/utils/constants';

// function TokenTypesPageISR(state: TokenTypesState): JSX.Element {
//   return (
//     <>
//       <Breadcrumbs />
//       <Intro
//         title="Token Types"
//         description={`In this page you can explore all the types of tokens that exist in ${brandName}.`}
//         note={`Refresh the page to get an updated version at most once every ${revalidateInterval} seconds.`}
//       />
//       <AllTokenTypes {...state} />
//     </>
//   );
// }

// const sdk = getBuiltGraphSDK();

// export const getStaticProps: GetStaticProps = async () => {
//   const lastUpdated = getTime();
//   try {
//     const dataRaw = await sdk.AllTokenTypes();
//     const data: TokenTypesStateData = { tokenTypes: allTokenTypesAdapter(dataRaw), lastUpdated };
//     return { props: { error: false, data }, revalidate: revalidateInterval };
//   } catch (e) {
//     const data: TokenTypesStateData = { tokenTypes: null, lastUpdated };
//     return { props: { error: true, data }, revalidate: revalidateInterval };
//   }
// };

// export default TokenTypesPageISR;
