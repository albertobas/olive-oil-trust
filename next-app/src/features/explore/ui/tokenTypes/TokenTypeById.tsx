import { useTokenTypeById } from 'next-app/src/features/explore/ui/hooks/useTokenTypeById';
import { roles } from 'next-app/src/shared/utils/constants';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import Image from 'next/image';
import styles from 'next-app/src/features/explore/styles/modules/tokenTypes/TokenTypeById.module.css';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { Role } from 'next-app/src/features/shared/utils/interfaces';
import TokenTypeInfo from 'next-app/src/features/explore/ui/tokenTypes/TokenTypeInfo';

function TokenTypeById({ id }: { id: string }): JSX.Element {
  const { error, data } = useTokenTypeById(id);

  if (error) {
    return <FallbackMessage message="Token types could not be retrieved" error />;
  }

  if (error === false) {
    if (data && data.tokenTypes && Object.keys(data.tokenTypes).includes(id)) {
      const { creationDate, identifier, instructions, member, metadata } = data.tokenTypes[id];
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

  return <FallbackMessage />;
}

export default TokenTypeById;
