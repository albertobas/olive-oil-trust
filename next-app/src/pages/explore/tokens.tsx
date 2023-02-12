/**
 * - TokensPageSSR uses getServerSideProps() to fetch data on server side.
 * - TokensPageCSR uses useAllTokens() to fetch data on client side.
 * - TokensPageISR uses getStaticProps() to fetch data at build time and re-generates
 *   the page per request at most once every `revalidateInterval` seconds on server side.
 */

import { GetServerSideProps } from 'next';
import { getBuiltGraphSDK } from 'next-app/.graphclient';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import Intro from 'next-app/src/features/shared/ui/intro/Intro';
import AllTokens from 'next-app/src/features/explore/ui/tokens/AllTokens';
import { brandName } from 'next-app/src/shared/utils/constants';
import allTokensAdapter from 'next-app/src/features/explore/core/adapters/allTokens.adapter';
import { ITokensState, ITokensStateData } from 'next-app/src/features/shared/utils/interfaces';
import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';

function TokensPageSSR(state: ITokensState): JSX.Element {
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
    const data: ITokensStateData = { tokens: allTokensAdapter(dataRaw), lastUpdated };
    return { props: { error: false, data } };
  } catch (e) {
    const data: ITokensStateData = { tokens: null, lastUpdated };
    return { props: { error: true, data } };
  }
};

export default TokensPageSSR;

// import { NextPage } from 'next';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from 'next-app/src/features/shared/ui/intro/Intro';
// import { useAllTokens } from 'next-app/src/features/explore/ui/hooks/useAllTokens';
// import { pollInterval } from 'next-app/src/features/shared/utils/constants';
// import AllTokens from 'next-app/src/features/explore/ui/tokens/AllTokens';
// import { brandName } from 'next-app/src/shared/utils/constants';

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
// import { getBuiltGraphSDK } from 'next-app/.graphclient';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import Intro from 'next-app/src/features/shared/ui/intro/Intro';
// import AllTokens from 'next-app/src/features/explore/ui/tokens/AllTokens';
// import { brandName } from 'next-app/src/shared/utils/constants';
// import allTokensAdapter from 'next-app/src/features/explore/core/adapters/allTokens.adapter';
// import { ITokensState, ITokensStateData } from 'next-app/src/features/shared/utils/interfaces';
// import { getTime } from 'next-app/src/features/shared/utils/helpers/helpers';
// import { revalidateInterval } from 'next-app/src/features/shared/utils/constants';

// function TokensPageISR(state: ITokensState): JSX.Element {
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
//     const data: ITokensStateData = { tokens: allTokensAdapter(dataRaw), lastUpdated };
//     return { props: { error: false, data }, revalidate: revalidateInterval };
//   } catch (e) {
//     const data: ITokensStateData = { tokens: null, lastUpdated };
//     return { props: { error: true, data }, revalidate: revalidateInterval };
//   }
// };

// export default TokensPageISR;
