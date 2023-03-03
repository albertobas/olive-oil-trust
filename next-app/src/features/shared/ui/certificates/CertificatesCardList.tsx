import styles from 'next-app/src/features/shared/styles/modules/certificates/CertificatesCardList.module.css';
import { useEffect, useState } from 'react';
import { sortCertificateArray } from 'next-app/src/features/shared/utils/helpers/certificate';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import CertificateCard from 'next-app/src/features/shared/ui/certificates/CertificateCard';
import { Certificate } from 'next-app/src/features/shared/core/entities/Certificates';

type Props = {
  data: Certificate[] | null;
  reverse: boolean;
  sort: IItem | null;
};

function CertificatesCardList({ data, reverse, sort }: Props): JSX.Element {
  const [stateData, setStateData] = useState<Certificate[] | null>(
    data ? (sort ? sortCertificateArray(data.slice(), sort?.value, reverse) : data) : null
  );
  useEffect(() => {
    setStateData(data ? (sort ? sortCertificateArray(data.slice(), sort?.value, reverse) : data) : null);
  }, [data, reverse, sort]);

  return (
    <div className={styles.layout}>
      {stateData && stateData.map((type) => <CertificateCard key={type.id} {...type} />)}
    </div>
  );
}

export default CertificatesCardList;
