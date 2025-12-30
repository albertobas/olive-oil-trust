import styles from '@features/shared/styles/modules/filters/Filters.module.css';
import { useMemo, Dispatch, SetStateAction } from 'react';
import { TokenType } from '@features/shared/core/entities/TokenTypes';
import { IItem } from '@features/shared/utils/interfaces';
import FilterSelect from '@features/shared/ui/filters/FilterSelect';
import { getItemsFromTypes } from '@features/shared/utils/helpers/helpers';

interface Props {
  data: TokenType[] | null;
  roleItems: IItem[] | null;
  setRoleItems: Dispatch<SetStateAction<IItem[] | null>>;
}

const FiltersTokenType = ({ roleItems, setRoleItems, data }: Props): JSX.Element => {
  const typeRole: keyof TokenType = 'member';
  const optionsRole = useMemo(() => {
    return data ? getItemsFromTypes(data, typeRole) : null;
  }, [data, typeRole]);

  const handleRole = (items: IItem[]) => {
    items.length > 0 ? setRoleItems(items) : setRoleItems(null);
  };

  return (
    <div className={styles.layout}>
      <FilterSelect
        options={optionsRole}
        title="Role"
        handleOnChange={handleRole}
        value={roleItems}
        placeholderFontSize="0.925rem"
        isMulti
      />
    </div>
  );
};

export default FiltersTokenType;
