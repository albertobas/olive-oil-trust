import { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, SetStateAction, useMemo, useState } from 'react';
import CertifyTokenTypes from '@features/management/ui/certificates/CertifyTokenTypes';
import useSignedMemberContract from '@features/shared/ui/hooks/useSignedMemberContract';
import SearchSortBar from '@features/shared/ui/search/SearchSortBar';
import { TokenType } from '@features/shared/core/entities/TokenTypes';
import { sortCertificateCardsRecords } from '@features/shared/utils/constants';
import ReactModal from 'react-modal';
import { IItem } from '@features/shared/utils/interfaces';
import styles from '@features/management/styles/modules/certificates/CertificatesControl.module.css';

type Props = {
  tokenTypes: TokenType[] | null;
  reverse: boolean;
  sort: IItem | null;
  query: string | null;
  setQuery: Dispatch<SetStateAction<string | null>>;
  setReverse: Dispatch<SetStateAction<boolean>>;
  setSort: Dispatch<SetStateAction<IItem | null>>;
};

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
      : 'Creator members have to create types of tokens first so that the types can be certified'
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
        searchKey="certificates"
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
