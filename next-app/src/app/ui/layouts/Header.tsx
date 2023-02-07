import styles from 'src/app/styles/modules/layout/Header.module.css';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import useConnection from 'next-app/src/app/ui/hooks/useConnection';
import NavBar from 'next-app/src/app/ui/layouts/NavBar';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { AiOutlineLogin, AiOutlineLogout } from 'react-icons/ai';
import Logo from 'next-app/src/app/ui/layouts/Logo';

export default function Header(): JSX.Element {
  const { connectWallet, disconnectWallet, isConnected, isConnecting } = useConnection();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <ILink href={'/'} aria-label="Logo">
          <Logo />
        </ILink>
      </div>
      <div className={styles.options}>
        <NavBar isConnected={isConnected} />
        <div className={styles.connect}>
          {isConnected ? (
            <button onClick={disconnectWallet}>Disconnect</button>
          ) : (
            <button disabled={isConnecting} onClick={connectWallet}>
              Connect
            </button>
          )}
        </div>
        <div className={styles.connectSm}>
          {isConnected ? (
            <button onClick={disconnectWallet} title="Disconnect">
              <SVG icon={AiOutlineLogout} />
            </button>
          ) : (
            <button disabled={isConnecting} onClick={connectWallet} title="Connect">
              <SVG icon={AiOutlineLogin} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
