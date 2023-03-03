import styles from 'next-app/src/features/shared/styles/modules/tokens/TokenCard.module.css';
import { join } from 'path';
import { pages } from 'next-app/src/shared/utils/constants';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { Token } from 'next-app/src/features/shared/core/entities/Tokens';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import Image from 'next/image';

const TokenCard = ({
  id,
  identifier,
  balance,
  industrialUnitTokenInfo,
  mintingDate,
  selfProduced,
  title,
  tokenType
}: Token): JSX.Element => {
  const tokenHref = join(pages.TOKENS.url, id);
  const tokenTypeHref = tokenType ? join(pages.TOKEN_TYPES.url, tokenType.id) : undefined;
  const date = mintingDate ? getUTCFromTimestamp(mintingDate) : null;
  const metadata = tokenType ? tokenType.metadata : null;
  const commercialUnits = industrialUnitTokenInfo ? industrialUnitTokenInfo.commercialUnits : null;

  return (
    <div className={selfProduced ? styles.layoutselfProduced : styles.layout}>
      {metadata && metadata.image && metadata.image.path && (
        <Image
          src={metadata.image.path}
          className={styles.img}
          alt={metadata.title ? metadata.title : undefined}
          width={400}
          height={400}
          quality={100}
        />
      )}
      <div className={styles.description}>
        <div className={styles.info}>
          <h2>
            <ILink href={tokenHref} aria-label={title}>
              {identifier}
            </ILink>
          </h2>
          {tokenType?.metadata && (
            <h3>
              <ILink href={tokenTypeHref} aria-label={identifier}>
                {tokenType.metadata.title}
              </ILink>
            </h3>
          )}
          {tokenType && (
            <p>
              <b>Type Identifier:</b> {tokenType.identifier}
            </p>
          )}
          {!selfProduced && tokenType && tokenType.member && (
            <p>
              <b>Manufacturer:</b> {tokenType.member.name}
            </p>
          )}
          {balance !== null && tokenType !== null && (
            <p>
              <b>Balance:</b>{' '}
              {`${
                tokenType.member
                  ? tokenType.member.role === 'OliveGrower'
                    ? `${balance / 1000} kg`
                    : tokenType.member.role === 'OliveOilMill'
                    ? `${balance / 1000} l`
                    : `${balance} units`
                  : `${balance} units`
              }`}
            </p>
          )}
          {tokenType === null && balance === 0 && (
            <p>
              <b>State:</b> Unpacked
            </p>
          )}
          {industrialUnitTokenInfo && (
            <>
              {!selfProduced && industrialUnitTokenInfo.member && (
                <p>
                  <b>Packer:</b> {industrialUnitTokenInfo.member.name}
                </p>
              )}
              <h3>Content</h3>
              <ul>
                {commercialUnits &&
                  Object.keys(commercialUnits).map((key) => {
                    const { amount, token } = commercialUnits[key];
                    const commercialUnitHref = join(pages.TOKENS.url, token.id);
                    const liTitle = token.tokenType?.metadata?.title
                      ? `${token.title} ${token.tokenType.metadata.title}`
                      : `Batch ${token.identifier}${token.tokenType ? ` Type ${token.tokenType.identifier}` : ''}`;
                    return (
                      <li key={token.id}>
                        {amount && (
                          <>
                            <span>{amount}</span> x{' '}
                          </>
                        )}
                        <span>
                          <ILink href={commercialUnitHref} aria-label={liTitle}>
                            {liTitle}
                          </ILink>
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
        </div>
        {date && <p>{date}</p>}
      </div>
    </div>
  );
};

export default TokenCard;
