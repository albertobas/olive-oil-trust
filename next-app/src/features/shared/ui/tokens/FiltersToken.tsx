import styles from 'src/features/shared/styles/modules/filters/Filters.module.css';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import FilterSelect from 'next-app/src/features/shared/ui/filters/FilterSelect';
import { getItemsFromTokens } from 'next-app/src/features/shared/utils/helpers';
import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';

interface Props {
  data: IToken[] | null;
  typeItems: IItem[] | null;
  manufacturerItems: IItem[] | null;
  packerItems: IItem[] | null;
  selfProducedItem: IItem | null;
  setTypeItems: Dispatch<SetStateAction<IItem[] | null>>;
  setManufacturerItems: Dispatch<SetStateAction<IItem[] | null>>;
  setPackerItems: Dispatch<SetStateAction<IItem[] | null>>;
  setSelfProducedItem: Dispatch<SetStateAction<IItem | null>>;
}

function FiltersToken({
  typeItems,
  manufacturerItems,
  packerItems,
  selfProducedItem,
  setTypeItems,
  setManufacturerItems,
  setPackerItems,
  setSelfProducedItem,
  data
}: Props): JSX.Element {
  const optionsType = useMemo(() => {
    return data ? getItemsFromTokens(data, 'type') : null;
  }, [data]);
  const optionsManufacturer = useMemo(() => {
    return data ? getItemsFromTokens(data, 'manufacturer') : null;
  }, [data]);
  const optionsPacker = useMemo(() => {
    return data ? getItemsFromTokens(data, 'packer') : null;
  }, [data]);

  const handleType = (items: IItem[]) => {
    items.length > 0 ? setTypeItems(items) : setTypeItems(null);
  };
  const handleManufacturer = (items: IItem[]) => {
    items.length > 0 ? setManufacturerItems(items) : setManufacturerItems(null);
  };
  const handlePacker = (items: IItem[]) => {
    items.length > 0 ? setPackerItems(items) : setPackerItems(null);
  };
  const handleSelfProduced = (item: IItem | null) => {
    setSelfProducedItem(item);
  };

  return (
    <div className={styles.layout}>
      <FilterSelect
        options={optionsManufacturer}
        title="Manufacturer"
        handleOnChange={handleManufacturer}
        value={manufacturerItems}
        placeholderFontSize="0.925rem"
        isMulti
      />
      <FilterSelect
        options={optionsPacker}
        title="Packer"
        handleOnChange={handlePacker}
        value={packerItems}
        placeholderFontSize="0.925rem"
        isMulti
      />
      <FilterSelect
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' }
        ]}
        title="Self produced"
        handleOnChange={handleSelfProduced}
        value={selfProducedItem}
        placeholderFontSize="0.925rem"
      />
      <FilterSelect
        options={optionsType}
        title="Type"
        handleOnChange={handleType}
        value={typeItems}
        placeholderFontSize="0.925rem"
        isMulti
      />
    </div>
  );
}

export default FiltersToken;
