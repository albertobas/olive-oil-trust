import { FieldProps } from 'formik';
import { FC } from 'react';
import Dropdown from 'next-app/src/features/shared/ui/dropdown/Dropdown';
import { OptionProps } from 'react-select';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';

const TokenTypesDropdown: FC<OptionProps<any> & FieldProps> = ({
  form: { setFieldValue },
  field,
  options
}): JSX.Element => {
  return (
    <Dropdown
      instanceId={field.name}
      handleOnChange={(option: IItem | null) => setFieldValue(field.name, option ? option.value : null)}
      value={
        options
          ? options
              .map((options) => options.options)
              .flat()
              .find((option) => option.value === field.value)
          : null
      }
      options={options}
      borderWidth="2px"
      borderColor="var(--gray-400)"
      borderColorHover="#000"
      placeholderColor="var(--gray-400)"
      isClearable
    />
  );
};

export default TokenTypesDropdown;
