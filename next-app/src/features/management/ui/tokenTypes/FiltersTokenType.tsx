import styles from 'src/features/shared/styles/modules/filters/Filters.module.css';
import { useMemo, Dispatch, SetStateAction } from 'react';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import FilterSelect from 'next-app/src/features/shared/ui/filters/FilterSelect';
import { getItemsFromTypes } from 'next-app/src/features/shared/utils/helpers/helpers';

interface Props {
  data: ITokenType[] | null;
  roleItems: IItem[] | null;
  setRoleItems: Dispatch<SetStateAction<IItem[] | null>>;
}

const FiltersTokenType = ({ roleItems, setRoleItems, data }: Props): JSX.Element => {
  const typeRole: keyof ITokenType = 'member';
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
