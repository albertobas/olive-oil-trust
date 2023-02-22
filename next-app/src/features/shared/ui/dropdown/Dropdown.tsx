import Select, { OptionsOrGroups } from 'react-select';
import { memo, useMemo } from 'react';
import { IGroupedItems, IItem } from 'next-app/src/features/shared/utils/interfaces';

type Props = {
  instanceId: string;
  handleOnChange: any;
  value: IItem | IItem[] | null;
  options: OptionsOrGroups<IItem, IGroupedItems> | null;
  backgroundColor?: string;
  borderColor?: string;
  borderColorHover?: string;
  borderWidth?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  placeholder?: string;
  placeholderColor?: string;
  placeholderFontSize?: string;
};

const Dropdown = ({
  instanceId,
  handleOnChange,
  options,
  backgroundColor,
  borderColor,
  borderColorHover,
  borderWidth,
  isClearable,
  isSearchable,
  isMulti,
  placeholder,
  placeholderColor,
  placeholderFontSize,
  value
}: Props) => {
  const styles = useMemo(() => {
    return {
      option: getSelectOption(borderColor),
      control: getSelectControl(borderWidth, borderColor, borderColorHover, backgroundColor, placeholderFontSize),
      input: getSelectInput(),
      menu: getSelectMenu(),
      menuList: getSelectMenuList(placeholderFontSize),
      placeholder: getSelectPlaceholder(placeholderColor)
    };
  }, [borderWidth, borderColor, borderColorHover, backgroundColor, placeholderColor, placeholderFontSize]);
  const stylesUni = useMemo(() => {
    return {
      ...styles,
      singleValue: (base: any) => ({
        ...base,
        color: 'var(--gray-800)'
      })
    };
  }, [styles]);
  const stylesMulti = useMemo(() => {
    return {
      ...styles,
      multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: 'var(--gray-200)'
      }),
      multiValueRemove: (provided: any) => ({
        ...provided,
        color: 'var(--gray-500',
        ':hover': {
          backgroundColor: 'var(--gray-500)',
          color: '#fff'
        }
      }),
      multiValueLabel: (base: any) => ({ ...base, color: 'var(--gray-800)' })
    };
  }, [styles]);
  return isMulti ? (
    <Select
      id={instanceId}
      aria-label={'Select ' + instanceId}
      instanceId={instanceId}
      isClearable={isClearable}
      isMulti
      components={{ IndicatorSeparator: () => null }}
      options={options !== null ? options : undefined}
      onChange={handleOnChange}
      placeholder={placeholder ? placeholder : 'Select '}
      value={value}
      styles={stylesMulti}
      isSearchable={isSearchable}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: 'var(--gray-600)'
        }
      })}
    />
  ) : (
    <Select
      id={instanceId}
      aria-label={'Select ' + instanceId}
      instanceId={instanceId}
      isClearable={isClearable}
      components={{ IndicatorSeparator: () => null }}
      options={options !== null ? options : undefined}
      onChange={handleOnChange}
      placeholder={placeholder ? placeholder : 'Select '}
      value={value ? value : null}
      styles={stylesUni}
      isSearchable={isSearchable}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: 'transparent'
        }
      })}
    />
  );
};

export default memo(Dropdown, areEqual);

function areEqual(prevProps: any, nextProps: any) {
  return prevProps.value === nextProps.value && prevProps.options === nextProps.options;
}

const getSelectOption = (borderColor: string | undefined) => {
  return (provided: any, { isSelected, isDisabled, isFocused }: any) => {
    return {
      ...provided,
      backgroundColor: isDisabled ? null : isSelected ? 'var(--gray-500)' : isFocused ? 'var(--gray-200)' : '#fff',
      borderColor: borderColor,
      color: isSelected ? '#fff' : isFocused ? '#000' : 'var(--text-global)',
      cursor: isDisabled ? 'not-allowed' : 'default'
    };
  };
};

const getSelectControl = (
  borderWidth: string | undefined,
  borderColor: string | undefined,
  borderColorHover: string | undefined,
  backgroundColor: string | undefined,
  placeholderFontSize: string | undefined
) => {
  return (base: any) => ({
    ...base,
    borderWidth: borderWidth ?? '1px',
    backgroundColor: backgroundColor ?? '#fff',
    borderColor: borderColor,
    borderRadius: 'var(--border-radius)',
    padding: 2,
    fontSize: placeholderFontSize,
    ':hover': {
      borderColor: borderColorHover ?? 'var(--gray-600)'
    },
    ':focus-within': {
      borderColor: 'var(--gray-600)'
    }
  });
};

const getSelectInput = () => {
  return (base: any) => ({
    ...base,
    color: 'var(--gray-800)'
  });
};

const getSelectMenu = () => {
  return (base: any) => ({
    ...base,
    borderWidth: 'none'
  });
};

const getSelectMenuList = (placeholderFontSize: string | undefined) => {
  return (base: any) => ({
    ...base,
    maxHeight: '30rem',
    paddingBottom: 0,
    paddingTop: 0,
    borderRadius: 'var(--border-radius)',
    backgroundColor: '#fff',
    fontSize: placeholderFontSize
  });
};

const getSelectPlaceholder = (placeholderColor: string | undefined) => {
  return (base: any) => ({
    ...base,
    color: placeholderColor ? placeholderColor : 'var(--gray-400)'
  });
};
