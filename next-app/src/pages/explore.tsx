import type { NextPage } from 'next';
import styles from 'src/app/styles/modules/sections/Section.module.css';
import { pages } from 'next-app/src/shared/utils/constants';
import Link from 'next/link';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

const Explore: NextPage = () => {
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);

  if (isConnecting) {
    return <FallbackMessage message="Waiting for connection." />;
  }

  if (isConnected) {
    return (
      <div className={styles.layout}>
        <h1>{pages.EXPLORE.title}</h1>
        <p>Explore all the certificates, types of tokens, tokens and escrows in Olive Oil Trust.</p>
        <ul>
          <li>
            <Link href={pages.CERTIFICATES.url} title={pages.CERTIFICATES.title}>
              {pages.CERTIFICATES.title}
            </Link>
          </li>
          <li>
            <Link href={pages.TOKEN_TYPES.url} title={pages.TOKEN_TYPES.title}>
              {pages.TOKEN_TYPES.title}
            </Link>
          </li>
          <li>
            <Link href={pages.TOKENS.url} title={pages.TOKENS.title}>
              {pages.TOKENS.title}
            </Link>
          </li>
          <li>
            <Link href={pages.ESCROWS.url} title={pages.ESCROWS.title}>
              {pages.ESCROWS.title}
            </Link>
          </li>
        </ul>
      </div>
    );
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page" />;
};

export default Explore;
