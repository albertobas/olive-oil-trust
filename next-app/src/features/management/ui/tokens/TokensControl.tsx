import { ButtonHTMLAttributes, DetailedHTMLProps, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import SearchSortBar from 'next-app/src/features/shared/ui/search/SearchSortBar';
import { sortTokenTypeCardsRecords } from 'next-app/src/features/shared/utils/constants';
import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import MintTokens from 'next-app/src/features/management/ui/tokens/MintTokens';
import {
  isBottlingPlant,
  isCreator,
  isDependentCreator,
  isDistributor,
  isIndependentCreator,
  isIndustrialUnitSeller,
  isManufacturedUnitSeller,
  isOliveGrower,
  isOliveOilMill,
  isPacker,
  isRetailer,
  isSeller,
  isUnpacker
} from 'next-app/src/shared/utils/constants';
import PackTokens from 'next-app/src/features/management/ui/tokens/PackTokens';
import UnpackTokens from 'next-app/src/features/management/ui/tokens/UnpackTokens';
import BurnTokens from 'next-app/src/features/management/ui/tokens/BurnTokens';
import DepositTokens from 'next-app/src/features/management/ui/tokens/DepositTokens';
import ReactModal from 'react-modal';
import styles from 'next-app/src/features/management/styles/modules/tokens/TokensControl.module.css';
import { Button } from 'next-app/src/features/shared/ui/buttons/Button';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';

type Props = {
  previousMemberTokens: IToken[] | null;
  commercialTokens: IToken[] | null;
  industrialUnitTokens: IToken[] | null;
  tokenTypes: ITokenType[] | null;
  reverse: boolean;
  sort: IItem | null;
  query: string | null;
  setQuery: Dispatch<SetStateAction<string | null>>;
  setReverse: Dispatch<SetStateAction<boolean>>;
  setSort: Dispatch<SetStateAction<IItem | null>>;
  setFilters?: Dispatch<SetStateAction<boolean>>;
};

const TokensControl = ({
  previousMemberTokens,
  commercialTokens,
  industrialUnitTokens,
  tokenTypes,
  reverse,
  sort,
  query,
  setQuery,
  setReverse,
  setSort,
  setFilters
}: Props): JSX.Element => {
  const [isMintingTokens, setIsMintingTokens] = useState<boolean>(false);
  const [isPackingTokens, setIsPackingTokens] = useState<boolean>(false);
  const [isUnpackingTokens, setIsUnpackingTokens] = useState<boolean>(false);
  const [isDepositingTokens, setIsDepositingTokens] = useState<boolean>(false);
  const [isBurningTokens, setIsBurningTokens] = useState<boolean>(false);
  const accountState = useAppSelector((state) => state.account);

  const sortOptions = useMemo(() => {
    return Object.keys(sortTokenTypeCardsRecords).map((key) => {
      return { label: sortTokenTypeCardsRecords[key as keyof typeof sortTokenTypeCardsRecords], value: key } as IItem;
    });
  }, []);

  if (!accountState.data) {
    return <></>;
  }

  function handleMintClick() {
    if (isPackingTokens) {
      setIsPackingTokens(false);
    }
    if (isUnpackingTokens) {
      setIsUnpackingTokens(false);
    }
    if (isDepositingTokens) {
      setIsDepositingTokens(false);
    }
    if (isBurningTokens) {
      setIsBurningTokens(false);
    }
    setIsMintingTokens((b) => !b);
  }
  function handlePackClick() {
    if (isMintingTokens) {
      setIsMintingTokens(false);
    }
    if (isUnpackingTokens) {
      setIsUnpackingTokens(false);
    }
    if (isDepositingTokens) {
      setIsDepositingTokens(false);
    }
    if (isBurningTokens) {
      setIsBurningTokens(false);
    }
    setIsPackingTokens((b) => !b);
  }
  function handleUnpackClick() {
    if (isMintingTokens) {
      setIsMintingTokens(false);
    }
    if (isPackingTokens) {
      setIsPackingTokens(false);
    }
    if (isDepositingTokens) {
      setIsDepositingTokens(false);
    }
    if (isBurningTokens) {
      setIsBurningTokens(false);
    }
    setIsUnpackingTokens((b) => !b);
  }
  function handleDepositClick() {
    if (isMintingTokens) {
      setIsMintingTokens(false);
    }
    if (isPackingTokens) {
      setIsPackingTokens(false);
    }
    if (isUnpackingTokens) {
      setIsUnpackingTokens(false);
    }
    if (isBurningTokens) {
      setIsBurningTokens(false);
    }
    setIsDepositingTokens((b) => !b);
  }
  function handleBurnClick() {
    if (isMintingTokens) {
      setIsMintingTokens(false);
    }
    if (isPackingTokens) {
      setIsPackingTokens(false);
    }
    if (isUnpackingTokens) {
      setIsUnpackingTokens(false);
    }
    if (isDepositingTokens) {
      setIsDepositingTokens(false);
    }
    setIsBurningTokens((b) => !b);
  }

  const isBurnDisabled = commercialTokens ? isBurningTokens : true;
  const modalProps = { className: styles.modal, overlayClassName: 'overlay' };

  if (!accountState.data.contract || !accountState.data.contract.moduleId) {
    // If user is not a member he is still permitted to burn his tokens
    const actionBtn: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> = {
      onClick: handleBurnClick,
      children: 'Burn Tokens',
      disabled: isBurnDisabled,
      title: isBurnDisabled ? 'Certify Token Types' : 'You need to own tokens to burn them.'
    };
    return (
      <>
        {(commercialTokens || industrialUnitTokens) && (
          <SearchSortBar
            query={query}
            reverse={reverse}
            sort={sort}
            options={sortOptions}
            searchKey="tokens"
            setReverse={setReverse}
            setQuery={setQuery}
            setSort={setSort}
            setFilters={setFilters}
            actionBtn={actionBtn}
          />
        )}
        <ReactModal isOpen={isBurningTokens} {...modalProps}>
          {commercialTokens && (
            <BurnTokens
              commercialTokens={commercialTokens}
              accountAddress={accountState.data.account}
              setIsBurningTokens={setIsBurningTokens}
            />
          )}
        </ReactModal>
      </>
    );
  }

  const { moduleId } = accountState.data.contract;
  const isDependentCreator_ = isDependentCreator(moduleId);
  const isMintDisabled = isDependentCreator_
    ? isMintingTokens || !previousMemberTokens || !tokenTypes
    : isMintingTokens;
  const isPackDisabled = isBottlingPlant(moduleId)
    ? (commercialTokens ? commercialTokens.filter((token) => token.selfProduced).length === 0 : true) || isPackingTokens
    : commercialTokens === null || isPackingTokens;
  const isUnpackDisabled = industrialUnitTokens ? isUnpackingTokens : true;
  const isDepositDisabled = isIndependentCreator(moduleId)
    ? isDepositingTokens || !commercialTokens
    : isOliveOilMill(moduleId)
    ? isDepositingTokens ||
      (commercialTokens ? commercialTokens.filter((token) => token.selfProduced).length === 0 : true)
    : isPacker(moduleId)
    ? isDepositingTokens ||
      (industrialUnitTokens ? industrialUnitTokens.filter((token) => token.selfProduced).length === 0 : true)
    : isRetailer(moduleId)
    ? isDepositingTokens || !commercialTokens
    : true;

  const unpacker = isBottlingPlant(moduleId)
    ? 'BottlingPlant'
    : isDistributor(moduleId)
    ? 'Distributor'
    : isRetailer(moduleId)
    ? 'Retailer'
    : null;
  const depositTokens =
    isOliveGrower(moduleId) || isManufacturedUnitSeller(moduleId) || isRetailer(moduleId)
      ? commercialTokens
      : isIndustrialUnitSeller(moduleId)
      ? industrialUnitTokens
      : null;

  return (
    <>
      {(commercialTokens || industrialUnitTokens) && (
        <SearchSortBar
          query={query}
          reverse={reverse}
          sort={sort}
          options={sortOptions}
          searchKey="tokens"
          setReverse={setReverse}
          setQuery={setQuery}
          setSort={setSort}
          setFilters={setFilters}
        />
      )}
      <div className={styles.layout}>
        {isCreator(moduleId) && (
          <Button onClick={handleMintClick} disabled={isMintDisabled}>
            Mint
          </Button>
        )}
        {isPacker(moduleId) && (
          <Button onClick={handlePackClick} disabled={isPackDisabled}>
            Pack
          </Button>
        )}
        {isUnpacker(moduleId) && (
          <Button onClick={handleUnpackClick} disabled={isUnpackDisabled}>
            Unpack
          </Button>
        )}
        {isSeller(moduleId) && (
          <Button onClick={handleDepositClick} disabled={isDepositDisabled}>
            Deposit
          </Button>
        )}
        <Button onClick={handleBurnClick} disabled={isBurnDisabled}>
          Burn
        </Button>
      </div>
      <ReactModal isOpen={isMintingTokens} {...modalProps}>
        <MintTokens
          previousMemberTokens={previousMemberTokens}
          tokenTypes={tokenTypes}
          isDependentCreator={isDependentCreator_}
          moduleId={moduleId}
          setIsMintingTokens={setIsMintingTokens}
        />
      </ReactModal>
      <ReactModal isOpen={isPackingTokens} {...modalProps}>
        {commercialTokens && (
          <PackTokens
            commercialTokens={commercialTokens}
            isDistributor={isDistributor(moduleId)}
            setIsPackingTokens={setIsPackingTokens}
          />
        )}
      </ReactModal>
      <ReactModal isOpen={isUnpackingTokens} {...modalProps}>
        {unpacker && industrialUnitTokens && (
          <UnpackTokens
            industrialUnitTokens={industrialUnitTokens}
            unpacker={unpacker}
            setIsUnpackingTokens={setIsUnpackingTokens}
          />
        )}
      </ReactModal>
      <ReactModal isOpen={isDepositingTokens} {...modalProps}>
        <DepositTokens tokens={depositTokens} moduleId={moduleId} setIsDepositingTokens={setIsDepositingTokens} />
      </ReactModal>
      <ReactModal isOpen={isBurningTokens} {...modalProps}>
        {commercialTokens && (
          <BurnTokens commercialTokens={commercialTokens} moduleId={moduleId} setIsBurningTokens={setIsBurningTokens} />
        )}
      </ReactModal>
    </>
  );
};

export default TokensControl;
