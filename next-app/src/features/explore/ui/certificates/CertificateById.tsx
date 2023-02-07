import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';
import styles from 'next-app/src/features/explore/styles/modules/certificates/CertificateById.module.css';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { pages } from 'next-app/src/shared/utils/constants';
import { join } from 'path';
import { ICertificateState } from 'next-app/src/features/shared/utils/interfaces';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';

function CertificateById({ error, data, id }: ICertificateState & { id: string }): JSX.Element {
  if (error) {
    return <FallbackMessage message={`The certificate ${id + (id.length ? ' ' : '')}could not be retrieved`} error />;
  }

  if (data) {
    const { identifier, creationDate, member, metadata, tokenTypes } = data;
    const creationDateUTC = getUTCFromTimestamp(creationDate);

    return (
      <div className={styles.layout}>
        <h1>{metadata ? metadata.title : identifier}</h1>
        <div className={styles.description}>
          <p>
            <b>Identifier:</b> {identifier}
          </p>
          {member && member.name && (
            <p>
              <b>Certifier:</b> {member.name}
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
        {tokenTypes && (
          <>
            <h2>Certified Token Types</h2>
            <p>The following is a list of all the types of tokens that are certified by this certificate:</p>
            <ul className={styles.listMargin}>
              {tokenTypes.map((type) => {
                const typeHref = join(pages.TOKEN_TYPES.url, type.id);
                return (
                  <li key={type.id}>
                    <ILink className={styles.anchor} href={typeHref} aria-label={`Certificate ${identifier}`}>
                      {type.metadata && type.metadata.title ? type.metadata.title : type.identifier}
                    </ILink>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
    );
  }

  return <FallbackMessage message={`The certificate ${id} does not exist`} error />;
}

export default CertificateById;
