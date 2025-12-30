import styles from '@features/shared/styles/modules/tokens/TokenCard.module.css';
import { pages } from '@shared/utils/constants';
import ILink from '@features/shared/ui/links/ILink';
import { TokenFields } from '@features/shared/core/entities/Tokens';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';
import Image from 'next/image';
import { join } from 'path';

type Props = TokenFields & { amount?: number };

function AncestryTokenCard({ id, identifier, mintingDate, selfProduced, tokenType }: Props): JSX.Element {
  const tokenHref = join(pages.TOKENS.url, id);
  const tokenTypeHref = tokenType ? join(pages.TOKEN_TYPES.url, tokenType.id) : undefined;
  const date = mintingDate ? getUTCFromTimestamp(mintingDate) : null;
  const metadata = tokenType ? tokenType.metadata : null;

  return (
    <div className={styles.layout}>
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
            <ILink href={tokenHref} aria-label={identifier}>
              {`Batch ${identifier}`}
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
        </div>
        {date && <p>{date}</p>}
      </div>
    </div>
  );
}

export default AncestryTokenCard;
