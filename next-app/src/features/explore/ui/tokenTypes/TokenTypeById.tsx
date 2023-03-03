import { roles } from 'next-app/src/shared/utils/constants';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import Image from 'next/image';
import styles from 'next-app/src/features/explore/styles/modules/tokenTypes/TokenTypeById.module.css';
import { Role } from 'next-app/src/features/shared/utils/interfaces';
import TokenTypeInfo from 'next-app/src/features/explore/ui/tokenTypes/TokenTypeInfo';
import { TokenTypeState } from 'next-app/src/features/shared/utils/interfaces';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

function TokenTypeById({ error, data, id }: TokenTypeState & { id: string }): JSX.Element {
  if (error) {
    return <FallbackMessage message={`The token type ${id + (id.length ? ' ' : '')}could not be retrieved`} error />;
  }

  if (data) {
    const { creationDate, identifier, instructions, member, metadata } = data;
    const creationDateUTC = getUTCFromTimestamp(creationDate);
    const memberRole = member && member.role ? roles[member.role as Role] : null;
    const memberName = member && member.name ? member.name : null;

    return (
      <div className={styles.layout}>
        <h1>{metadata ? metadata.title : identifier}</h1>
        <div className={styles.introLayout}>
          <div className={styles.description}>
            <p>
              <b>Type Identifier:</b> {identifier}
            </p>
            {memberName && (
              <p>
                <b>Manufacturer:</b> {`${memberName} ${memberRole ? `(${memberRole})` : ''}`}
              </p>
            )}
            {creationDateUTC && (
              <p>
                <b>Date:</b> {creationDateUTC}
              </p>
            )}
            {metadata && metadata.description && (
              <p>
                <b>Description:</b> {metadata.description}
              </p>
            )}
          </div>
          {metadata && metadata.image && metadata.image.path && (
            <div>
              <Image
                src={metadata.image.path}
                alt={metadata.title ? metadata.title : undefined}
                width={250}
                height={250}
                quality={100}
              />
            </div>
          )}
        </div>
        <TokenTypeInfo identifier={identifier} instructions={instructions} metadata={metadata} />
      </div>
    );
  }
  return <FallbackMessage message={`The token type ${id} does not exist`} error />;
}

export default TokenTypeById;
