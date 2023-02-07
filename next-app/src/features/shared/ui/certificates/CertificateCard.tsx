import styles from 'next-app/src/features/shared/styles/modules/certificates/CertificateCard.module.css';
import { join } from 'path';
import { pages } from 'next-app/src/shared/utils/constants';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers/helpers';

function CertificateCard({ id, identifier, member, creationDate, metadata }: ICertificate): JSX.Element {
  const href = join(pages.CERTIFICATES.url, id);
  const date = getUTCFromTimestamp(creationDate);

  return (
    <div className={styles.layout}>
      <div className={styles.info}>
        <h2>
          <ILink href={href} aria-label={identifier}>
            {metadata ? metadata.title : identifier}
          </ILink>
        </h2>
        <p>
          <b>Identifier:</b> {identifier}
        </p>
        {member && (
          <p>
            <b>Certifier:</b> {member.name}
          </p>
        )}
        {metadata && metadata.description && <p>{metadata.description}</p>}
      </div>
      {date && <p>{date}</p>}
    </div>
  );
}

export default CertificateCard;
