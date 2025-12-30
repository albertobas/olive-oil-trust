import { FieldProps, useFormikContext } from 'formik';
import { FC } from 'react';
import { IGroupedItems, IItem } from '@features/shared/utils/interfaces';
import Dropdown from '@features/shared/ui/dropdown/Dropdown';
import { OptionProps } from 'react-select';
import { IFormikTokenType } from '@features/management/utils/interfaces';

const TokenTypesDropdownFiltered: FC<OptionProps<any> & FieldProps> = ({ form, field, options }): JSX.Element => {
  const { values } = useFormikContext();
  const selectedIds = (values as IFormikTokenType).fieldArray.map((field) => field.id);
  const filteredOpts = (options as IGroupedItems[]).map<IGroupedItems>((group) => {
    return { label: group.label, options: group.options.filter((item) => !selectedIds.includes(item.value)) };
  });
  const value = options
    ? options
        .map((options) => options.options)
        .flat()
        .find((option) => option.value === field.value)
    : null;

  return (
    <div>
      <Dropdown
        instanceId={field.name}
        handleOnChange={(option: IItem | null) => form.setFieldValue(field.name, option ? option.value : null)}
        value={value}
        options={filteredOpts}
        borderWidth="2px"
        borderColor="var(--gray-400)"
        borderColorHover="#000"
        placeholderColor="var(--gray-400)"
        isClearable
      />
    </div>
  );
};

export default TokenTypesDropdownFiltered;
