import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import useSignedMemberContract from '@features/shared/ui/hooks/useSignedMemberContract';
import { Token } from '@features/shared/core/entities/Tokens';
import { toast } from 'react-toastify';
import { ErrorMessage, Field, FieldArray, FieldProps, Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { IFormikDepositToken } from '@features/management/utils/interfaces';
import { formatBytes32String, formatUnits } from 'ethers/lib/utils';
import styles from '@features/shared/styles/modules/forms/Form.module.css';
import { Root as Label } from '@radix-ui/react-label';
import FallbackMessage from '@features/shared/ui/fallbackMessage/FallbackMessage';
import {
  getGroupedTokensByType,
  getTokenNameFromModule,
  getTokenUnitFromModule,
  transferDepositTokens
} from '@features/management/utils/helpers';
import { FaTimes } from 'react-icons/fa';
import SVG from '@features/shared/ui/svg/SVG';
import { BsTrash } from 'react-icons/bs';
import { ImPaste } from 'react-icons/im';
import {
  handleAddressValidation,
  handlePriceValidation,
  handleSelectValidation
} from '@features/shared/ui/utils/helpers';
import { IGroupedItems, IItem } from '@features/shared/utils/interfaces';
import useAppSelector from '@shared/ui/hooks/useAppSelector';
import { renderToast } from '@shared/utils/helpers';
import { Module } from '@shared/utils/interfaces';
import {
  isIndustrialUnitSeller,
  isManufacturedUnitSeller,
  isOliveGrower,
  isOliveOilMill,
  isRetailer
} from '@shared/utils/constants';
import { handleAmountValidation } from '@features/management/utils/helpers';
import Dropdown from '@features/shared/ui/dropdown/Dropdown';
import { OptionProps } from 'react-select';
import TokensDropdownMulti from '@features/shared/ui/tokens/TokensDropdownMulti';
import { BigNumber } from 'ethers';
import PriceLabel from '@features/shared/ui/forms/PriceLabel';

type Props = {
  tokens: Token[] | null;
  moduleId: Module;
  setIsDepositingTokens: Dispatch<SetStateAction<boolean>>;
};

function DepositTokens({ tokens, moduleId, setIsDepositingTokens }: Props): JSX.Element {
  const { error, data } = useSignedMemberContract();
  const accounState = useAppSelector((state) => state.account);
  const [priceUnit, setPriceUnit] = useState<'wei' | 'gwei' | 'ether'>('ether');
  const tokensRecords = useMemo(() => {
    if (tokens && tokens.length > 0) {
      const tokens_: Record<string, { identifier: string; contract: string; type: string | null }> = {};
      tokens.forEach(
        (token) =>
          (tokens_[token.id] = {
            identifier: token.identifier,
            contract: token.contract,
            type: token.tokenType ? token.tokenType.identifier : null
          })
      );
      return tokens_;
    }
    return null;
  }, [tokens]);

  const tokensOptions = useMemo<IItem[] | null>(() => {
    if (tokens) {
      const options: IItem[] = [];
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].selfProduced)
          options.push({
            label: `Pallet ${tokens[i].identifier}`,
            value: tokens[i].id
          });
      }
      return options.length ? options : null;
    }
    return null;
  }, [tokens]);

  const fieldArrayIdGroupOpts: IGroupedItems[] | null = useMemo(() => {
    if (tokens) {
      if (isRetailer(moduleId)) {
        return getGroupedTokensByType(tokens);
      }
      return getGroupedTokensByType(tokens.filter((token) => token.selfProduced));
    }
    return null;
  }, [tokens, moduleId]);

  const tokenName = getTokenNameFromModule(moduleId);

  if (error) {
    return (
      <div className={styles.layoutFit}>
        <div className={styles.header}>
          <h1>{`Deposit${tokenName ? ' '.concat(tokenName) : ''}`}</h1>
          <button className={styles.closeBtn} onClick={handleCancel}>
            <SVG icon={FaTimes} />
          </button>
        </div>
        <FallbackMessage message="An abstraction of the contract could not be created" error />
      </div>
    );
  }

  if (!data) {
    // loading
    return <FallbackMessage />;
  }

  const account = accounState.data ? accounState.data.account : null;
  const isOliveGrower_ = isOliveGrower(moduleId);
  const isIndustrialUnitSeller_ = isIndustrialUnitSeller(moduleId);

  function handleSubmit(
    { price, sellerWallet, ids, fieldArray }: IFormikDepositToken,
    { resetForm }: FormikHelpers<IFormikDepositToken>
  ) {
    const isOliveOilMill_ = isOliveOilMill(moduleId);
    const isManufacturedUnitSeller_ = isManufacturedUnitSeller(moduleId);
    const tokenAddresses: string[] = [];
    const tokenTypeIds: string[] = [];
    const tokenIds: string[] = [];
    const tokenAmounts: number[] = [];
    const parsedPrice =
      priceUnit === 'ether'
        ? (parseFloat(price) * 1e18).toFixed(0).toString()
        : priceUnit === 'gwei'
          ? (parseFloat(price) * 1e9).toFixed(0).toString()
          : parseInt(price).toString();
    if (tokensRecords) {
      if (isIndustrialUnitSeller_) {
        if (ids) {
          for (let i = 0; i < ids.length; i++) {
            if (ids[i]) {
              const identifier = tokensRecords[ids[i]].identifier;
              tokenIds.push(formatBytes32String(identifier));
            }
          }
        }
      } else {
        for (let i = 0; i < fieldArray.length; i++) {
          const { id, amount } = fieldArray[i];
          if (id) {
            const type = tokensRecords[id].type;
            const identifier = tokensRecords[id].identifier;
            tokenAddresses.push(tokensRecords[id].contract);
            if (type) {
              tokenTypeIds.push(formatBytes32String(type));
            }
            tokenIds.push(formatBytes32String(identifier));
            if (amount.length) {
              const amount_ = isOliveGrower_ || isOliveOilMill_ ? parseInt(amount) * 1000 : parseInt(amount);
              tokenAmounts.push(amount_);
            }
          }
        }
      }
    }
    const toastId = toast.loading('Waiting for wallet response...');
    transferDepositTokens(
      data,
      parsedPrice,
      sellerWallet,
      tokenAddresses,
      tokenTypeIds,
      tokenIds,
      tokenAmounts,
      isOliveGrower_,
      isManufacturedUnitSeller_,
      isIndustrialUnitSeller_
    )
      .then((numTokens) => {
        renderToast(toastId, 'The transaction has succeeded.');
        console.log(
          `The transaction has succeeded.\n${numTokens} token${numTokens > 1 ? 's' : ''} ${
            numTokens > 1 ? 'have' : 'has'
          } been deposited`
        );
      })
      .catch((error) => {
        renderToast(toastId, 'The transaction has failed.', error);
        console.error(
          `The transaction has failed.\n${error.code ? `\nError code: ${error.code}\nError message: ` : ''}${
            error.message
          }`
        );
      })
      .finally(() => {
        resetForm();
        setIsDepositingTokens(false);
      });
  }

  function handleCancel() {
    setIsDepositingTokens(false);
  }

  const initialValues: IFormikDepositToken = {
    price: '',
    sellerWallet: '',
    ids: null,
    fieldArray: [{ id: null, amount: '' }]
  };

  return (
    <div className={`${styles.layout} ${styles.minH40}`}>
      <div className={styles.header}>
        <h1>{`Deposit${tokenName ? ' '.concat(tokenName) : ''}`}</h1>
        <button className={styles.closeBtn} onClick={handleCancel}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <Formik initialValues={initialValues} onSubmit={(values, resetForm) => handleSubmit(values, resetForm)}>
        {({ values: { price, fieldArray }, resetForm, setFieldValue }) => {
          function handlePriceUnitClick(newUnit: 'ether' | 'gwei' | 'wei') {
            setPriceUnit(newUnit);
            if (price.length > 0) {
              let newPrice;
              if (priceUnit === 'ether') {
                newPrice = parseInt(
                  formatUnits(BigNumber.from((parseFloat(price) * 1.0e18).toString()), newUnit)
                ).toString();
              } else if (priceUnit === 'gwei') {
                newPrice = parseInt(
                  formatUnits(BigNumber.from((parseFloat(price) * 1.0e9).toString()), newUnit)
                ).toString();
              } else {
                newPrice = parseInt(formatUnits(BigNumber.from(price), newUnit)).toString();
              }
              setFieldValue('price', newPrice);
            }
          }
          return (
            <Form className={styles.content}>
              <div className={styles.form}>
                <div className={styles.fieldBtnPair}>
                  <div className={styles.field}>
                    <Label htmlFor="sellerWallet">Seller wallet *</Label>
                    <Field name="sellerWallet" validate={handleAddressValidation} />
                  </div>
                  <ErrorMessage name="sellerWallet" component="div" className={styles.fieldError} />
                  {account && (
                    <button
                      type="button"
                      title="Paste wallet address"
                      onClick={() => setFieldValue('sellerWallet', account)}
                    >
                      <SVG icon={ImPaste} />
                    </button>
                  )}
                </div>
                {!isOliveGrower_ && (
                  <div className={styles.field}>
                    <PriceLabel priceUnit={priceUnit} handlePriceUnitClick={handlePriceUnitClick} />
                    <Field name="price" validate={handlePriceValidation} />
                    <ErrorMessage name="price" component="div" className={styles.fieldError} />
                  </div>
                )}
                {isIndustrialUnitSeller_ ? (
                  <div className={styles.field}>
                    <Label htmlFor="ids">Pallets *</Label>
                    <div className={styles.fieldBtnPair}>
                      <div>
                        <Field
                          name="ids"
                          component={TokensDropdownMulti}
                          options={tokensOptions}
                          validate={(value: string | null) => handleSelectValidation(value, 'batch id')}
                        />
                      </div>
                    </div>
                    <ErrorMessage name="ids" component="div" className={styles.fieldError} />
                  </div>
                ) : (
                  <FieldArray name="fieldArray">
                    {({ remove, push }) => {
                      const isAddBatchDisabled = Boolean(
                        fieldArrayIdGroupOpts &&
                        fieldArray.length ===
                          fieldArrayIdGroupOpts
                            .map((group) => group.options.length)
                            .reduce((acc, current) => acc + current, 0)
                      );
                      return (
                        <div className={styles.fieldArray}>
                          {<p className={styles.title}>{tokenName ? ' '.concat(tokenName) : 'Tokens'}</p>}
                          {fieldArray.length > 0 &&
                            fieldArray.map(({}, index) => (
                              <div key={index} className={styles.fieldBtnPair}>
                                <div className={styles.fieldArrayMultiInputMargin}>
                                  <div className={styles.field}>
                                    <Label htmlFor={`fieldArray.${index}.id`}>{`Batch Id *`}</Label>
                                    <Field
                                      name={`fieldArray.${index}.id`}
                                      component={DepositDropdown}
                                      options={fieldArrayIdGroupOpts}
                                      validate={(value: string | null) => handleSelectValidation(value, 'batch id')}
                                    />
                                    <ErrorMessage
                                      name={`fieldArray.${index}.id`}
                                      component="div"
                                      className={styles.fieldError}
                                    />
                                  </div>
                                  <div className={styles.field}>
                                    <Label htmlFor={`fieldArray.${index}.amount`}>
                                      {`Amount (${getTokenUnitFromModule(moduleId)}) *`}
                                    </Label>
                                    <Field name={`fieldArray.${index}.amount`} validate={handleAmountValidation} />
                                    <ErrorMessage
                                      name={`fieldArray.${index}.amount`}
                                      component="div"
                                      className={styles.fieldError}
                                    />
                                  </div>
                                </div>
                                <button type="button" disabled={fieldArray.length === 1} onClick={() => remove(index)}>
                                  <SVG icon={BsTrash} />
                                </button>
                              </div>
                            ))}
                          <div className={styles.addField}>
                            <button
                              type="button"
                              onClick={() => push({ id: null, amount: '' })}
                              disabled={isAddBatchDisabled}
                            >
                              Add batch
                            </button>
                          </div>
                        </div>
                      );
                    }}
                  </FieldArray>
                )}
                <div className={styles.formSubmit}>
                  <button type="submit" onClick={() => resetForm()}>
                    Reset form
                  </button>
                </div>
              </div>
              <div className={styles.actionBtns}>
                <button className={styles.submitBtn} type="submit">
                  Deposit
                </button>
                <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}

export default DepositTokens;

const DepositDropdown: FC<OptionProps<any> & FieldProps> = ({
  form: { setFieldValue },
  field,
  options
}): JSX.Element => {
  const { values } = useFormikContext();
  const { fieldArray } = values as IFormikDepositToken;
  const selectedIds = fieldArray ? fieldArray.map(({ id }) => id) : null;
  const filteredOpts = options
    ? (options as IGroupedItems[]).map<IGroupedItems>((group) => {
        return {
          label: group.label,
          options: group.options.filter((item) => selectedIds && !selectedIds.includes(item.value))
        };
      })
    : [];
  const value = options
    ? ((options as IGroupedItems[])
        .map((options) => options.options)
        .flat()
        .find((item) => item.value === field.value) ?? null)
    : null;

  return (
    <Dropdown
      instanceId={field.name}
      handleOnChange={(option: IItem | null) => setFieldValue(field.name, option ? option.value : null)}
      value={value}
      options={filteredOpts}
      borderWidth="2px"
      borderColor="var(--gray-400)"
      borderColorHover="#000"
      placeholderColor="var(--gray-400)"
      isClearable
      isSearchable
    />
  );
};
