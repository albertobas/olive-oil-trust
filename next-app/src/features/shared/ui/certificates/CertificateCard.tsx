import styles from 'next-app/src/features/shared/styles/modules/certificates/CertificateCard.module.css';
import { join } from 'path';
import { pages } from 'next-app/src/shared/utils/constants';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { getUTCFromTimestamp } from 'next-app/src/features/shared/utils/helpers';

function CertificateCard({ id, identifier, creationDate, metadata }: ICertificate): JSX.Element {
  const href = join(pages.CERTIFICATES.url, id);
  const date = getUTCFromTimestamp(creationDate);

  return (
    <div className={styles.layout}>
      <h2>
        <ILink href={href} aria-label={identifier}>
          {metadata ? metadata.title : identifier}
        </ILink>
      </h2>
      <h3 className={styles.tag}>
        <ILink href={href} aria-label={identifier}>
          {'#' + identifier}
        </ILink>
      </h3>
      {date && <p className={styles.date}>{date}</p>}
    </div>
  );
}

export default CertificateCard;
