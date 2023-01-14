import { memo } from 'react';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import styles from 'src/features/management/styles/modules/certificates/CertifyTokenTypesCard.module.css';
import { FaTimes } from 'react-icons/fa';
import { ICertifyTokenTypeState } from 'next-app/src/features/management/utils/interfaces';

type Props = ICertifyTokenTypeState & {
  handleDelCertificate: (id: string) => void;
};

const CertifyTokenTypesCard = ({ certificateId, tokenTypeTitles, handleDelCertificate }: Props) => {
  return (
    <div className={styles.card}>
      <div className={styles.remove}>
        <button className={styles.removeBtn} onClick={() => handleDelCertificate(certificateId)}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <h2>{certificateId}</h2>
      <h3>Token types</h3>
      <ul>
        {tokenTypeTitles.map((title, idx) => {
          return <li key={idx}>{title}</li>;
        })}
      </ul>
    </div>
  );
};

export default memo(CertifyTokenTypesCard);
