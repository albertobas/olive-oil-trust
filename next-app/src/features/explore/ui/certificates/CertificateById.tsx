import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { useCertificateById } from 'next-app/src/features/explore/ui/hooks/useCertificateById';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';
import styles from 'next-app/src/features/explore/styles/modules/certificates/CertificateById.module.css';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { pages } from 'next-app/src/shared/utils/constants';
import { join } from 'path';

function CertificateById({ id }: { id: string }): JSX.Element {
  const { error, data } = useCertificateById(id);

  if (error) {
    return <FallbackMessage message="Certificates could not be retreived" error />;
  }

  if (error === false) {
    if (data && data.certificates && Object.keys(data.certificates).includes(id)) {
      const { identifier, creationDate, member, metadata, tokenTypes } = data.certificates[id];
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
                      <ILink href={typeHref} aria-label={`Certificate ${identifier.toString()}`}>
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

    return <FallbackMessage message={`Error: the certificate ${id} does not exist`} error />;
  }

  return <FallbackMessage />;
}

export default CertificateById;
