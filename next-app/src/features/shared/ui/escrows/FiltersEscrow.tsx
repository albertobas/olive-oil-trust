import styles from 'src/features/shared/styles/modules/filters/Filters.module.css';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import FilterSelect from 'next-app/src/features/shared/ui/filters/FilterSelect';
import { IEscrow } from 'next-app/src/features/shared//core/entities/Escrows';
import { getItemsFromEscrows } from 'next-app/src/features/shared/utils/helpers';

interface Props {
  data: IEscrow[] | null;
  stateItems: IItem[] | null;
  buyerItems: IItem[] | null;
  sellerItems: IItem[] | null;
  setStateItems: Dispatch<SetStateAction<IItem[] | null>>;
  setBuyerItems: Dispatch<SetStateAction<IItem[] | null>>;
  setSellerItems: Dispatch<SetStateAction<IItem[] | null>>;
}

function FiltersEscrow({
  stateItems,
  buyerItems,
  sellerItems,
  setStateItems,
  setBuyerItems,
  setSellerItems,
  data
}: Props): JSX.Element {
  const optionsState = useMemo(() => {
    return data ? getItemsFromEscrows(data, 'state') : null;
  }, [data]);
  const optionsBuyer = useMemo(() => {
    return data ? getItemsFromEscrows(data, 'buyer') : null;
  }, [data]);
  const optionsSeller = useMemo(() => {
    return data ? getItemsFromEscrows(data, 'seller') : null;
  }, [data]);

  const handleState = (items: IItem[]) => {
    items.length > 0 ? setStateItems(items) : setStateItems(null);
  };
  const handleBuyer = (items: IItem[]) => {
    items.length > 0 ? setBuyerItems(items) : setBuyerItems(null);
  };
  const handleSeller = (items: IItem[]) => {
    items.length > 0 ? setSellerItems(items) : setSellerItems(null);
  };

  return (
    <div className={styles.layout}>
      <FilterSelect
        options={optionsBuyer}
        title="Buyer"
        handleOnChange={handleBuyer}
        value={buyerItems}
        placeholderFontSize="0.925rem"
        isMulti
      />
      <FilterSelect
        options={optionsSeller}
        title="Seller"
        handleOnChange={handleSeller}
        value={sellerItems}
        placeholderFontSize="0.925rem"
        isMulti
      />
      <FilterSelect
        options={optionsState}
        title="State"
        handleOnChange={handleState}
        value={stateItems}
        placeholderFontSize="0.925rem"
        isMulti
      />
    </div>
  );
}

export default FiltersEscrow;
