import type { NextPage } from 'next';
import styles from 'src/app/styles/modules/home/Home.module.css';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { pages } from 'next-app/src/shared/utils/constants';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';

const Home: NextPage = () => {
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);
  const title = 'Buy, sell and trace products in the Olive Oil Trust value chain';
  const paragraph =
    'Olive Oil Trust is an olive oil traceability solution built on Ethereum that allows its members to trace and ' +
    'trade an ERC-1155 token representation of their own products, and end customers to trace and buy these tokens.';

  return (
    <div className={styles.layout}>
      {isConnecting ? (
        <FallbackMessage loading message="Waiting for connection" />
      ) : isConnected ? (
        <>
          <h1>{title}</h1>
          <p>{paragraph}</p>
          <p>
            You can either{' '}
            <ILink href={pages.MANAGEMENT.url} title={pages.MANAGEMENT.title}>
              manage
            </ILink>{' '}
            your products or certificates or{' '}
            <ILink href={pages.EXPLORE.url} title={pages.EXPLORE.title}>
              explore
            </ILink>{' '}
            others.
          </p>
        </>
      ) : (
        <>
          <h2>{title}</h2>
          <p>{paragraph}</p>
        </>
      )}
    </div>
  );
};

export default Home;
