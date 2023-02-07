import { memo } from 'react';
import styles from 'src/features/shared/styles/modules/filters/FilterSelect.module.css';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import Dropdown from 'next-app/src/features/shared/ui/dropdown/Dropdown';

type Props = {
  options: IItem[] | null;
  title: string;
  handleOnChange(item: IItem | IItem[] | null): void;
  value: IItem | IItem[] | null;
  placeholderFontSize: string;
  isMulti?: boolean;
};

export default memo(function FilterSelect({ options, title, handleOnChange, value, isMulti }: Props) {
  return (
    <div className={styles.advancedRow}>
      <p className={styles.advancedLabel}>{title}</p>
      <div className={styles.dd}>
        <Dropdown
          instanceId={'select_' + title}
          borderColor="var(--gray-200)"
          placeholderFontSize="0.925rem"
          placeholderColor="var(--gray-400)"
          isClearable={true}
          isMulti={isMulti}
          handleOnChange={handleOnChange}
          options={options}
          value={value}
        />
      </div>
    </div>
  );
});
