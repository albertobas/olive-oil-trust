import styles from 'next-app/src/features/shared/styles/modules/tokens/TokenCard.module.css';
import { join } from 'path';
import { pages } from 'next-app/src/shared/utils/constants';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import Image from 'next/image';

const TokenCard = ({
  id,
  identifier,
  balance,
  industrialUnitTokenInfo,
  mintingDate,
  selfProduced,
  tokenType
}: IToken): JSX.Element => {
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
          height={400}
          width={400}
          quality={100}
        />
      )}
      <div className={styles.description}>
        <h2>
          <ILink href={tokenHref} aria-label={identifier}>
            {`${industrialUnitTokenInfo ? 'Pallet' : 'Batch'} ${identifier}`}
          </ILink>
        </h2>
        {tokenType && (
          <>
            {tokenType.metadata && (
              <h3>
                <ILink href={tokenTypeHref} aria-label={identifier}>
                  {tokenType.metadata.title}
                </ILink>
              </h3>
            )}
            <p className={styles.tag}>{'#' + tokenType.identifier}</p>
          </>
        )}
        {!selfProduced && tokenType && tokenType.member && (
          <p>
            <b>Manufacturer:</b> {tokenType.member.name}
          </p>
        )}
        {!selfProduced && industrialUnitTokenInfo && industrialUnitTokenInfo.member && (
          <p>
            <b>Packer:</b> {industrialUnitTokenInfo.member.name}
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
            <h3>Content</h3>
            <ul>
              {commercialUnits &&
                Object.keys(commercialUnits).map((key) => {
                  const { amount, token } = commercialUnits[key];
                  const commercialUnitHref = join(pages.TOKENS.url, token.id);
                  const title = token.tokenType?.metadata?.title
                    ? `Batch ${token.identifier} ${token.tokenType.metadata.title}`
                    : `Batch ${token.identifier}${token.tokenType ? ` Type ${token.tokenType.identifier}` : ''}`;
                  return (
                    <li key={token.id}>
                      {amount && (
                        <>
                          <span>{amount}</span> x{' '}
                        </>
                      )}
                      <h4>
                        <ILink href={commercialUnitHref} aria-label={`Batch ${identifier.toString()}`}>
                          {title}
                        </ILink>
                      </h4>
                    </li>
                  );
                })}
            </ul>
          </>
        )}
        {date && <p className={styles.date}>{date}</p>}
      </div>
    </div>
  );
};

export default TokenCard;
