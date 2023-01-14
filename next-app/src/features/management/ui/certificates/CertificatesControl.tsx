import { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, SetStateAction, useMemo, useState } from 'react';
import CertifyTokenTypes from 'next-app/src/features/management/ui/certificates/CertifyTokenTypes';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import SearchSortBar from 'next-app/src/features/shared/ui/search/SearchSortBar';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { sortCertificateCardsRecords } from 'next-app/src/features/shared/utils/constants';
import ReactModal from 'react-modal';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import styles from 'next-app/src/features/management/styles/modules/certificates/CertificatesControl.module.css';

type Props = {
  tokenTypes: ITokenType[] | null;
  reverse: boolean;
  sort: IItem | null;
  query: string | null;
  setQuery: Dispatch<SetStateAction<string | null>>;
  setReverse: Dispatch<SetStateAction<boolean>>;
  setSort: Dispatch<SetStateAction<IItem | null>>;
};

export interface ICertificateState {
  id: string;
  instructedAddresses: string[];
  instructedIds: string[];
  instructedAmounts: number[];
  instructedTitles: (string | null)[];
}

const CertificatesControl = ({
  tokenTypes,
  reverse,
  sort,
  query,
  setQuery,
  setReverse,
  setSort
}: Props): JSX.Element => {
  const [isAddingCertificates, setIsAddingCertificates] = useState<boolean>(false);
  const contract = useSignedMemberContract();
  const sortOptions = useMemo(() => {
    return Object.keys(sortCertificateCardsRecords).map((key) => {
      return {
        label: sortCertificateCardsRecords[key as keyof typeof sortCertificateCardsRecords],
        value: key
      } as IItem;
    });
  }, []);

  function handleClick() {
    setIsAddingCertificates((b) => !b);
  }
  const isActionBtnDisabled = Boolean(isAddingCertificates || !tokenTypes);
  const actionBtn: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> = {
    onClick: handleClick,
    children: 'Certify Token Types',
    disabled: isActionBtnDisabled,
    title: isActionBtnDisabled
      ? 'Certify Token Types'
      : 'Creators have to create token types first in order to certifying them'
  };

  if (!tokenTypes && !contract) {
    return <></>;
  }
  return (
    <>
      <SearchSortBar
        query={query}
        reverse={reverse}
        sort={sort}
        options={sortOptions}
        actionBtn={actionBtn}
        setReverse={setReverse}
        setQuery={setQuery}
        setSort={setSort}
      />
      <ReactModal isOpen={isAddingCertificates} className={styles.modal} overlayClassName="overlay">
        {tokenTypes && <CertifyTokenTypes tokenTypes={tokenTypes} setIsAddingCertificates={setIsAddingCertificates} />}
      </ReactModal>
    </>
  );
};

export default CertificatesControl;
