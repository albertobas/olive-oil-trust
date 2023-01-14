import styles from 'next-app/src/features/shared/styles/modules/tokenTypes/TokenTypeCard.module.css';
import { getInstuctionTokenUnitFromModule } from 'next-app/src/features/management/ui/utils/helpers';
import Image from 'next/image';
import { join } from 'path';
import { isOliveGrower, isOliveOilMill, pages } from 'next-app/src/shared/utils/constants';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';

const TokenTypeCard = ({ id, identifier, instructions, creationDate, metadata }: ITokenType): JSX.Element => {
  const href = join(pages.TOKEN_TYPES.url, id);
  const date = getUTCFromTimestamp(creationDate);
  return (
    <div className={styles.layout}>
      <>
        {metadata && metadata.image && metadata.image.path && (
          <ILink href={href} aria-label={identifier}>
            <Image
              src={metadata.image.path}
              className={styles.img}
              alt={metadata.title ? metadata.title : undefined}
              height={400}
              width={400}
              quality={100}
            />
          </ILink>
        )}
        <div className={styles.description}>
          <h2>
            <ILink href={href} aria-label={identifier}>
              {metadata ? metadata.title : identifier}
            </ILink>
          </h2>
          <p className={styles.tag}>{'#' + identifier}</p>
          {metadata && metadata.description && <p>{metadata.description}</p>}
          {instructions && (
            <>
              <h3>Instructions</h3>
              <ul>
                {instructions.map(({ amount, id, isCertificate, title, instructorModuleId }) => {
                  const instructionHref = join(isCertificate ? pages.CERTIFICATES.url : pages.TOKEN_TYPES.url, id);
                  const unit = instructorModuleId ? getInstuctionTokenUnitFromModule(instructorModuleId) : null;
                  return (
                    <li key={id}>
                      {amount && (
                        <>
                          <span>
                            {instructorModuleId
                              ? isOliveGrower(instructorModuleId) || isOliveOilMill(instructorModuleId)
                                ? `${amount} ${unit}`
                                : `${amount} unit${amount > 1 ? 's' : ''}`
                              : amount}
                          </span>{' '}
                          x{' '}
                        </>
                      )}
                      <h4>
                        <ILink href={instructionHref} aria-label={`Batch ${identifier.toString()}`}>
                          {title}
                        </ILink>
                      </h4>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          {<p>{date}</p>}
        </div>
      </>
    </div>
  );
};

export default TokenTypeCard;
