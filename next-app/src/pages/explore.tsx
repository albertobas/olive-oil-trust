import type { NextPage } from 'next';
import styles from 'src/app/styles/modules/sections/Section.module.css';
import { brandName, pages } from 'next-app/src/shared/utils/constants';
import Link from 'next/link';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

const Explore: NextPage = () => {
  const { isConnecting } = useAppSelector((state) => state.connection);

  if (isConnecting) {
    return <FallbackMessage message="Waiting for connection." />;
  }

  return (
    <div className={styles.layout}>
      <h1>{pages.EXPLORE.title}</h1>
      <p>Explore all the certificates, types of tokens, tokens and escrows in {brandName}.</p>
      <ul>
        <li>
          <Link href={pages.CERTIFICATES.url} title={pages.CERTIFICATES.title}>
            {pages.CERTIFICATES.title}
          </Link>
        </li>
        <li>
          <Link href={pages.ESCROWS.url} title={pages.ESCROWS.title}>
            {pages.ESCROWS.title}
          </Link>
        </li>
        <li>
          <Link href={pages.TOKENS.url} title={pages.TOKENS.title}>
            {pages.TOKENS.title}
          </Link>
        </li>
        <li>
          <Link href={pages.TOKEN_TYPES.url} title={pages.TOKEN_TYPES.title}>
            {pages.TOKEN_TYPES.title}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Explore;
