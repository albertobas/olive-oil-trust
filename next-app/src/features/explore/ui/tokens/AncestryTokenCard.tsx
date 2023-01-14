import styles from 'next-app/src/features/shared/styles/modules/tokens/TokenCard.module.css';
import { pages } from 'next-app/src/shared/utils/constants';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { ITokenFields } from 'next-app/src/features/shared/core/entities/Tokens';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import Image from 'next/image';
import { join } from 'path';

type Props = ITokenFields & { amount?: number };

function AncestryTokenCard({ id, identifier, mintingDate, selfProduced, tokenType }: Props): JSX.Element {
  const tokenHref = join(pages.TOKENS.url, id);
  const tokenTypeHref = tokenType ? join(pages.TOKEN_TYPES.url, tokenType.id) : undefined;
  const date = mintingDate ? getUTCFromTimestamp(mintingDate) : null;
  const metadata = tokenType ? tokenType.metadata : null;

  return (
    <div className={styles.layout}>
      {metadata && metadata.image && metadata.image.path && (
        <div className={styles.imgWrapper}>
          <Image
            src={metadata.image.path}
            className={styles.img}
            alt={metadata.title ? metadata.title : undefined}
            width={400}
            height={400}
            quality={100}
          />
        </div>
      )}
      <div className={styles.description}>
        <h2>
          <ILink href={tokenHref} aria-label={identifier}>
            {`Batch ${identifier}`}
          </ILink>
        </h2>
        {tokenType && (
          <>
            {tokenType.metadata && <h3>{tokenType.metadata.title}</h3>}
            <h4 className={styles.tag}>
              <ILink href={tokenTypeHref} aria-label={identifier}>
                {'#' + tokenType.identifier}
              </ILink>
            </h4>
          </>
        )}
        {!selfProduced && tokenType && tokenType.member && (
          <p>
            <b>Manufacturer:</b> {tokenType.member.name}
          </p>
        )}
        {date && <p className={styles.date}>{date}</p>}
      </div>
    </div>
  );
}

export default AncestryTokenCard;
