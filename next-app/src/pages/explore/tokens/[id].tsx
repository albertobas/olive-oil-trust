/**
 * - DynamicTokenPageSSR uses getServerSideProps() to fetch data on server side.
 * - DynamicTokenPageCSR uses useTokenById() to fetch data on client side.
 * - DynamicTokenPageISR uses getStaticProps() to fetch data at build time and re-generates
 *   the page per request at most once every `revalidateInterval` seconds on server side.
 */

import { GetStaticProps, GetStaticPaths } from 'next';
import TokenById from '@features/explore/ui/tokens/TokenById';
import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
import { getBuiltGraphSDK } from '.graphclient';
import tokenByIdAdapter from '@features/explore/core/adapters/tokenById.adapter';
import { revalidateInterval } from '@features/shared/utils/constants';
import { TokenState } from '@features/shared/utils/interfaces';

function DynamicTokenPageISR(props: TokenState & { id: string }): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <TokenById {...props} />
    </>
  );
}

const sdk = getBuiltGraphSDK();

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params) {
    const { id } = params;
    try {
      const dataRaw = typeof id === 'string' ? await sdk.TokenById({ id: id }) : null;
      const data = dataRaw ? tokenByIdAdapter(dataRaw) : null;
      return { props: { error: false, data, id }, revalidate: revalidateInterval };
    } catch (e) {
      return { props: { error: true, data: null, id }, revalidate: revalidateInterval };
    }
  }
  return { props: { error: true, data: null, id: '' }, revalidate: revalidateInterval };
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const dataRaw = await sdk.AllTokens();
    const paths = dataRaw.tokens.map(({ id }) => ({ params: { id } }));
    return { paths, fallback: 'blocking' };
  } catch (e) {
    return { paths: [{ params: { id: '' } }], fallback: 'blocking' };
  }
};

export default DynamicTokenPageISR;

// import { GetServerSideProps } from 'next';
// import TokenById from '@features/explore/ui/tokens/TokenById';
// import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
// import { getBuiltGraphSDK } from '.graphclient';
// import tokenByIdAdapter from '@features/explore/core/adapters/tokenById.adapter';
// import { TokenState } from '@features/shared/utils/interfaces';

// function DynamicTokenPageSSR(props: TokenState & { id: string }): JSX.Element {
//   return (
//     <>
//       <Breadcrumbs />
//       <TokenById {...props} />
//     </>
//   );
// }

// const sdk = getBuiltGraphSDK();

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const { id } = query;
//   try {
//     const dataRaw = typeof id === 'string' ? await sdk.TokenById({ id: id }) : null;
//     const data = dataRaw ? tokenByIdAdapter(dataRaw) : null;
//     return { props: { error: false, data, id } };
//   } catch (e) {
//     return { props: { error: true, data: null, id } };
//   }
// };

// export default DynamicTokenPageSSR;

// import { NextPage } from 'next';
// import { useRouter } from 'next/router';
// import TokenByIdCSR from '@features/explore/ui/tokens/TokenByIdCSR';
// import Breadcrumbs from '@features/shared/ui/breadcrumbs/Breadcrumbs';
// import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';

// const DynamicTokenPageCSR: NextPage = () => {
//   const { query, isReady } = useRouter();
//   const { id } = query;

//   return (
//     <>
//       <Breadcrumbs />
//       {isReady ? (
//         typeof id === 'string' ? (
//           <TokenByIdCSR id={id} />
//         ) : (
//           <FallbackMessage message="Unable to retrieve the token id." error />
//         )
//       ) : (
//         <FallbackMessage />
//       )}
//     </>
//   );
// };

// export default DynamicTokenPageCSR;
