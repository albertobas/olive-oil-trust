/**
 * - DynamicTokenTypePageISR uses getStaticProps() to fetch data at build time and re-generates
 *   the page per request at most once every `revalidateInterval` seconds on server side.
 * - DynamicTokenTypePageSSR uses getServerSideProps() to fetch data on server side.
 * - DynamicTokenTypePageCSR uses useTokenTypeById() to fetch data on client side.
 */

import { GetStaticProps, GetStaticPaths } from 'next';
import TokenTypeById from 'next-app/src/features/explore/ui/tokenTypes/TokenTypeById';
import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
import { getBuiltGraphSDK } from 'next-app/.graphclient';
import tokenTypeByIdAdapter from 'next-app/src/features/explore/core/adapters/tokenTypeById.adapter';
import { revalidateInterval } from 'next-app/src/features/shared/utils/constants';
import { TokenTypeState } from 'next-app/src/features/shared/utils/interfaces';

function DynamicTokenTypePageISR(props: TokenTypeState & { id: string }): JSX.Element {
  return (
    <>
      <Breadcrumbs />
      <TokenTypeById {...props} />
    </>
  );
}

const sdk = getBuiltGraphSDK();

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (params) {
    const { id } = params;
    try {
      const dataRaw = typeof id === 'string' ? await sdk.TokenTypeById({ id: id }) : null;
      const data = dataRaw ? tokenTypeByIdAdapter(dataRaw) : null;
      return { props: { error: false, data, id }, revalidate: revalidateInterval };
    } catch (e) {
      return { props: { error: true, data: null, id }, revalidate: revalidateInterval };
    }
  }
  return { props: { error: true, data: null, id: '' }, revalidate: revalidateInterval };
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const dataRaw = await sdk.AllTokenTypes();
    const paths = dataRaw.tokenTypes.map(({ id }) => ({ params: { id } }));
    return { paths, fallback: 'blocking' };
  } catch (e) {
    return { paths: [{ params: { id: '' } }], fallback: 'blocking' };
  }
};

export default DynamicTokenTypePageISR;

// import { GetServerSideProps } from 'next';
// import TokenTypeById from 'next-app/src/features/explore/ui/tokenTypes/TokenTypeById';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import { getBuiltGraphSDK } from 'next-app/.graphclient';
// import tokenTypeByIdAdapter from 'next-app/src/features/explore/core/adapters/tokenTypeById.adapter';
// import { TokenTypeState } from 'next-app/src/features/shared/utils/interfaces';

// function DynamicTokenTypePageSSR(props: TokenTypeState & { id: string }): JSX.Element {
//   return (
//     <>
//       <Breadcrumbs />
//       <TokenTypeById {...props} />
//     </>
//   );
// }

// const sdk = getBuiltGraphSDK();

// export const getServerSideProps: GetServerSideProps = async ({ query }) => {
//   const { id } = query;
//   try {
//     const dataRaw = typeof id === 'string' ? await sdk.TokenTypeById({ id: id }) : null;
//     const data = dataRaw ? tokenTypeByIdAdapter(dataRaw) : null;
//     return { props: { error: false, data, id } };
//   } catch (e) {
//     return { props: { error: true, data: null, id } };
//   }
// };

// export default DynamicTokenTypePageSSR;

// import { NextPage } from 'next';
// import { useRouter } from 'next/router';
// import TokenTypeByIdCSR from 'next-app/src/features/explore/ui/tokenTypes/TokenTypeByIdCSR';
// import Breadcrumbs from 'next-app/src/features/shared/ui/breadcrumbs/Breadcrumbs';
// import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

// const DynamicTokenTypePageCSR: NextPage = () => {
//   const { query, isReady } = useRouter();
//   const { id } = query;

//   return (
//     <>
//       <Breadcrumbs />
//       {isReady ? (
//         typeof id === 'string' ? (
//           <TokenTypeByIdCSR id={id} />
//         ) : (
//           <FallbackMessage message="Unable to retrieve the token type id." error />
//         )
//       ) : (
//         <FallbackMessage />
//       )}
//     </>
//   );
// };

// export default DynamicTokenTypePageCSR;
