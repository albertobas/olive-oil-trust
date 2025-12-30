/**
 * - TokensPageSSR uses getServerSideProps() to fetch data on server side.
 * - TokensPageCSR uses useAllTokens() to fetch data on client side.
 * - TokensPageISR uses getStaticProps() to fetch data at build time and re-generates
 *   the page per request at most once every `revalidateInterval` seconds on server side.
 */

import { GetServerSideProps } from 'next';
import { getBuiltGraphSDK } from '.graphclient';
import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from '@features/shared/ui/intro/Intro';
import AllTokens from '@features/explore/ui/tokens/AllTokens';
import { brandName } from '@shared/utils/constants';
import allTokensAdapter from '@features/explore/core/adapters/allTokens.adapter';
import { TokensState, TokensStateData } from '@features/shared/utils/interfaces';
import { getTime } from '@features/shared/utils/helpers/helpers';

function TokensPageSSR(state: TokensState): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <Intro
        title="Tokens"
        description={`In this page you can explore all the tokens that exist in ${brandName}.`}
        note="This page updates per request."
      />
      <AllTokens {...state} />
    </>
  );
}

const sdk = getBuiltGraphSDK();

export const getServerSideProps: GetServerSideProps = async () => {
  const lastUpdated = getTime();
  try {
    const dataRaw = await sdk.AllTokens();
    const data: TokensStateData = { tokens: allTokensAdapter(dataRaw), lastUpdated };
    return { props: { error: false, data } };
  } catch (e) {
    const data: TokensStateData = { tokens: null, lastUpdated };
    return { props: { error: true, data } };
  }
};

export default TokensPageSSR;

// import { NextPage } from 'next';
// import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from '@features/shared/ui/intro/Intro';
// import { useAllTokens } from '@features/explore/ui/hooks/useAllTokens';
// import { pollInterval } from '@features/shared/utils/constants';
// import AllTokens from '@features/explore/ui/tokens/AllTokens';
// import { brandName } from '@shared/utils/constants';

// const TokensPageCSR: NextPage = () => {
//   const state = useAllTokens(pollInterval);

//   return (
//     <>
//       <Breadcrumbs />
//       <Intro title="Tokens" description={`In this page you can explore all the tokens that exist in ${brandName}.`} />
//       <AllTokens {...state} />
//     </>
//   );
// };

// export default TokensPageCSR;

// import { GetStaticProps } from 'next';
// import { getBuiltGraphSDK } from '.graphclient';
// import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from '@features/shared/ui/intro/Intro';
// import AllTokens from '@features/explore/ui/tokens/AllTokens';
// import { brandName } from '@shared/utils/constants';
// import allTokensAdapter from '@features/explore/core/adapters/allTokens.adapter';
// import { TokensState, TokensStateData } from '@features/shared/utils/interfaces';
// import { getTime } from '@features/shared/utils/helpers/helpers';
// import { revalidateInterval } from '@features/shared/utils/constants';

// function TokensPageISR(state: TokensState): JSX.Element {
//   return (
//     <>
//       <Breadcrumbs />
//       <Intro
//         title="Tokens"
//         description={`In this page you can explore all the tokens that exist in ${brandName}.`}
//         note={`Refresh the page to get an updated version at most once every ${revalidateInterval} seconds.`}
//       />
//       <AllTokens {...state} />
//     </>
//   );
// }

// const sdk = getBuiltGraphSDK();

// export const getStaticProps: GetStaticProps = async () => {
//   const lastUpdated = getTime();
//   try {
//     const dataRaw = await sdk.AllTokens();
//     const data: TokensStateData = { tokens: allTokensAdapter(dataRaw), lastUpdated };
//     return { props: { error: false, data }, revalidate: revalidateInterval };
//   } catch (e) {
//     const data: TokensStateData = { tokens: null, lastUpdated };
//     return { props: { error: true, data }, revalidate: revalidateInterval };
//   }
// };

// export default TokensPageISR;
