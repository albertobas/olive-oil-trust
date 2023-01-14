import { FieldProps } from 'formik';
import { FC } from 'react';
import { OptionProps } from 'react-select';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import Dropdown from 'next-app/src/features/shared/ui/dropdown/Dropdown';

const TokenTypesDropdownMulti: FC<OptionProps<any> & FieldProps> = ({
  form: { setFieldValue },
  field,
  options
}): JSX.Element => {
  let values: IItem[] | null = null;
  if (options) {
    values = [];
    for (let i = 0; i < options.length; i++) {
      for (let j = 0; j < options[i].options.length; j++) {
        if (field && field.value && field.value.includes(options[i].options[j].value)) {
          values.push(options[i].options[j]);
        }
      }
    }
  }
  function handleOnChange(items: IItem[] | null) {
    if (items && items.length) {
      setFieldValue(
        field.name,
        items.map((item) => item.value)
      );
    } else {
      setFieldValue(field.name, items);
    }
  }

  return (
    <Dropdown
      instanceId={field.name}
      handleOnChange={handleOnChange}
      value={values}
      options={options}
      borderWidth="2px"
      borderColor="var(--gray-400)"
      borderColorHover="#000"
      placeholderColor="var(--gray-400)"
      isClearable
      isSearchable
      isMulti
    />
  );
};

export default TokenTypesDropdownMulti;
