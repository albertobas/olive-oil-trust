import styles from '@features/shared/styles/modules/certificates/CertificateCard.module.css';
import { join } from 'path';
import { pages } from '@shared/utils/constants';
import ILink from '@features/shared/ui/links/ILink';
import { Certificate } from '@features/shared/core/entities/Certificates';
import { getUTCFromTimestamp } from '@features/shared/utils/helpers/helpers';

function CertificateCard({ id, identifier, member, creationDate, metadata }: Certificate): JSX.Element {
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
