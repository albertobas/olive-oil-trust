import type { NextPage } from 'next';
import styles from 'src/app/styles/modules/sections/Section.module.css';
import {
  isSeller,
  isCertifier,
  isDependentCreator,
  isDistributor,
  isIndependentCreator,
  isRetailer,
  pages
} from 'next-app/src/shared/utils/constants';
import Link from 'next/link';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

const Management: NextPage = () => {
  const { isConnected, isConnecting } = useAppSelector((state) => state.connection);
  const { data } = useAppSelector((state) => state.account);

  if (isConnecting) {
    return <FallbackMessage message="Waiting for connection." />;
  }

  if (isConnected) {
    if (data) {
      if (data.contract && data.contract.moduleId) {
        const { moduleId } = data.contract;
        return (
          <div className={styles.layout}>
            <h1>{pages.MANAGEMENT.title}</h1>
            <p>{`${
              isCertifier(moduleId)
                ? 'Certify token types.'
                : isIndependentCreator(moduleId)
                ? 'Create your token types. Mint, burn or deposit your tokens. Manage your escrows.'
                : isDependentCreator(moduleId)
                ? 'Create your token types. Mint, burn or deposit your tokens. Manage your escrows and participations, i.e., the escrows you have interacted with.'
                : isDistributor(moduleId) || isRetailer(moduleId)
                ? 'Mint, burn or deposit your tokens. Manage your escrows and participations, i.e., the escrows you have interacted with.'
                : ''
            }`}</p>
            <ul>
              {isCertifier(moduleId) && (
                <li>
                  <Link href={pages.MY_CERTIFICATES.url} title={pages.MY_CERTIFICATES.title}>
                    {pages.MY_CERTIFICATES.title}
                  </Link>
                </li>
              )}
              {(isIndependentCreator(moduleId) || isDependentCreator(moduleId)) && (
                <li>
                  <Link href={pages.MY_TOKEN_TYPES.url} title={pages.MY_TOKEN_TYPES.title}>
                    {pages.MY_TOKEN_TYPES.title}
                  </Link>
                </li>
              )}
              {!isCertifier(moduleId) && (
                <li>
                  <Link href={pages.MY_TOKENS.url} title={pages.MY_TOKENS.title}>
                    {pages.MY_TOKENS.title}
                  </Link>
                </li>
              )}
              {(isDependentCreator(moduleId) || isDistributor(moduleId) || isRetailer(moduleId)) && (
                <li>
                  <Link href={pages.MY_PARTICIPATIONS.url} title={pages.MY_PARTICIPATIONS.title}>
                    {pages.MY_PARTICIPATIONS.title}
                  </Link>
                </li>
              )}
              {isSeller(moduleId) && (
                <li>
                  <Link href={pages.MY_ESCROWS.url} title={pages.MY_ESCROWS.title}>
                    {pages.MY_ESCROWS.title}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        );
      } else {
        // Any end customer
        return (
          <div className={styles.layout}>
            <h1>{pages.MANAGEMENT.title}</h1>
            <p>
              Mint, burn or deposit your tokens. Manage your participations, i.e., the escrows you have interacted with.
            </p>
            <ul>
              <li>
                <Link href={pages.MY_TOKENS.url} title={pages.MY_TOKENS.title}>
                  {pages.MY_TOKENS.title}
                </Link>
              </li>
              <li>
                <Link href={pages.MY_PARTICIPATIONS.url} title={pages.MY_PARTICIPATIONS.title}>
                  {pages.MY_PARTICIPATIONS.title}
                </Link>
              </li>
            </ul>
          </div>
        );
      }
    }

    return <FallbackMessage message="Account information could not be retrieved" error />;
  }

  return <FallbackMessage message="You need to connect to Olive Oil Trust to see this page" />;
};

export default Management;
