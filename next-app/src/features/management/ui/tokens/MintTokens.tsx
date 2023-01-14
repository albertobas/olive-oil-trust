import { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import { IGroupedItems, IItem } from 'next-app/src/features/shared/utils/interfaces';
import { IFormikMintToken, IMintTokenState } from 'next-app/src/features/management/utils/interfaces';
import { toast } from 'react-toastify';
import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import styles from 'next-app/src/features/shared/styles/modules/forms/Form.module.css';
import IdentifierTypeAmountCard from 'next-app/src/features/management/ui/tokens/IdentifierTypeAmountCard';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { Formik, Form, Field, FieldArray, FormikHelpers, ErrorMessage, useFormikContext, FieldProps } from 'formik';
import { Root as Label } from '@radix-ui/react-label';
import { handleAmountValidation, handleStringValidation } from 'next-app/src/features/management/utils/helpers';
import {
  getGroupedTokensByType,
  getTokenNameFromModule,
  getTokenUnitFromModule,
  transferMintedTokens
} from 'next-app/src/features/management/ui/utils/helpers';
import Carousel from 'react-multi-carousel';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { FaTimes } from 'react-icons/fa';
import { AiFillCaretDown } from 'react-icons/ai';
import { BsTrash } from 'react-icons/bs';
import { handleSelectValidation } from 'next-app/src/features/shared/ui/utils/helpers';
import { renderToast } from 'next-app/src/shared/utils/helpers';
import { Module } from 'next-app/src/shared/utils/interfaces';
import { isOliveGrower, isOliveOilMill } from 'next-app/src/shared/utils/constants';
import Dropdown from 'next-app/src/features/shared/ui/dropdown/Dropdown';
import { OptionProps } from 'react-select';
import { carouselResponsive } from 'next-app/src/features/management/ui/utils/constants';

type Props = {
  previousMemberTokens: IToken[] | null;
  tokenTypes: ITokenType[] | null;
  isDependentCreator: boolean;
  moduleId: Module;
  setIsMintingTokens: Dispatch<SetStateAction<boolean>>;
};

function MintTokens({
  previousMemberTokens,
  tokenTypes,
  isDependentCreator,
  moduleId,
  setIsMintingTokens
}: Props): JSX.Element {
  const [tokens, setTokens] = useState<IMintTokenState[] | null>(null);

  const [batchFields, setBatchFields] = useState<{
    tokenId?: string;
    tokenTypeId?: IItem | null;
    tokenAmount?: string;
  } | null>(null);

  const { error, data } = useSignedMemberContract();

  const tokenRecords = useMemo(() => {
    if (previousMemberTokens && previousMemberTokens.length > 0) {
      const tokens: Record<string, { identifier: string; contract: string; type: string }> = {};
      for (let i = 0; i < previousMemberTokens.length; i++) {
        const { id, identifier, contract, tokenType } = previousMemberTokens[i];
        if (tokenType) {
          tokens[id] = { identifier, contract, type: tokenType.identifier };
        }
      }
      return tokens;
    }
    return null;
  }, [previousMemberTokens]);

  const tokenTypesRecords = useMemo(() => {
    if (tokenTypes && tokenTypes.length) {
      const types: Record<string, ITokenType> = {};
      tokenTypes.forEach((type) => (types[type.identifier] = type));
      return types;
    }
    return null;
  }, [tokenTypes]);

  const inputTokenGroupedOptionsFiltered = useCallback(
    (includedTypes: string[], excludedTokenIds?: string[]) => {
      if (previousMemberTokens) {
        return getGroupedTokensByType(
          previousMemberTokens.filter(({ id }) => (excludedTokenIds ? !excludedTokenIds?.includes(id) : true)),
          includedTypes
        );
      }
      return null;
    },
    [previousMemberTokens]
  );

  const tokenTypeOptions: IItem[] | null = useMemo(() => {
    if (tokenTypes) {
      return tokenTypes.map(({ metadata, identifier }) => {
        return {
          label: `${identifier}${metadata && metadata.title ? ` - ${metadata.title}` : ''}`,
          value: identifier
        };
      });
    } else {
      return null;
    }
  }, [tokenTypes]);

  const initialValues: IFormikMintToken = useMemo(() => {
    if (
      tokenTypesRecords &&
      batchFields &&
      batchFields.tokenTypeId &&
      Object.keys(tokenTypesRecords).includes(batchFields.tokenTypeId.value)
    ) {
      const instructions = Object.keys(tokenTypesRecords).includes(batchFields.tokenTypeId.value)
        ? tokenTypesRecords[batchFields.tokenTypeId.value as keyof typeof tokenTypesRecords].instructions
        : null;
      if (instructions) {
        const fields: Record<
          string,
          {
            data: {
              id: string | null;
              amount: string;
            }[];
            shouldConvert: boolean;
          }
        > = {};
        for (let i = 0; i < instructions.length; i++) {
          const { id, instructorModuleId } = instructions[i];
          fields[id] = {
            data: [{ id: null, amount: '' }],
            shouldConvert:
              instructorModuleId === 'OliveGrowerUpgradeable' || instructorModuleId === 'OliveOilMillUpgradeable'
          };
        }
        return { tokenId: '', tokenTypeId: '', tokenAmount: '', fields };
      }
    }
    return { tokenId: '', tokenTypeId: '', tokenAmount: '', fields: {} };
  }, [batchFields, tokenTypesRecords]);

  const tokenName = getTokenNameFromModule(moduleId);

  if (error) {
    return (
      <div className={styles.layoutFit}>
        <div className={styles.header}>
          <h1>{`Mint${tokenName ? ' '.concat(tokenName) : ''}`}</h1>
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

  function handleCancel() {
    setIsMintingTokens(false);
    setTokens(null);
  }
  function handleDelToken(id: string) {
    if (tokens) {
      if (tokens.length == 1) {
        setTokens(null);
      } else {
        setTokens((prevState) => {
          return prevState && prevState.filter((token) => token.tokenTypeId.concat('_', token.tokenId) != id);
        });
      }
    }
  }

  function handleFormSubmit({ fields, ...rest }: IFormikMintToken, { resetForm }: FormikHelpers<IFormikMintToken>) {
    if (isDependentCreator) {
      const inputAddresses: string[][] = [];
      const inputTypeIds: string[][] = [];
      const inputIds: string[][] = [];
      const inputAmounts: number[][] = [];
      if (tokenRecords && Object.keys(fields).length) {
        for (let i = 0; i < Object.keys(fields).length; i++) {
          inputAddresses[i] = [];
          inputTypeIds[i] = [];
          inputIds[i] = [];
          inputAmounts[i] = [];
          const key = Object.keys(fields)[i];
          const { data, shouldConvert } = fields[key as keyof typeof fields];
          for (let j = 0; j < data.length; j++) {
            const { id, amount } = data[j];
            const floatAmount = parseFloat(amount);
            if (id) {
              inputAddresses[i].push(tokenRecords[id].contract);
              inputTypeIds[i].push(tokenRecords[id].type);
              inputIds[i].push(tokenRecords[id].identifier);
              inputAmounts[i].push(shouldConvert ? parseInt((floatAmount * 1000).toString()) : parseInt(amount));
            }
          }
        }
      }
      if (batchFields) {
        const { tokenAmount, tokenId, tokenTypeId } = batchFields;
        if (tokenAmount && tokenId && tokenTypeId && tokenRecords) {
          const token: IMintTokenState = {
            tokenAmount: isOliveOilMill(moduleId)
              ? parseInt((parseFloat(tokenAmount) * 1000).toString())
              : parseInt(tokenAmount),
            tokenId,
            tokenIdentifier: tokenId,
            tokenTypeId: tokenTypeId.value,
            inputAddresses,
            inputTypeIds,
            inputIds,
            inputAmounts
          };
          setTokens((prevState) => {
            if (prevState) {
              prevState.push(token);
              return [...prevState];
            }
            return [token];
          });
        }
      }
    } else {
      const { tokenAmount, tokenId, tokenTypeId } = rest;
      const token: IMintTokenState = {
        tokenAmount: isOliveGrower(moduleId) ? parseInt(tokenAmount) * 1000 : parseInt(tokenAmount),
        tokenId,
        tokenIdentifier: tokenId,
        tokenTypeId
      };
      setTokens((prevState) => {
        if (prevState) {
          prevState.push(token);
          return [...prevState];
        }
        return [token];
      });
    }
    resetForm();
    setBatchFields(null);
  }

  function handleSubmit() {
    const toastId = toast.loading('Waiting for wallet response...');
    transferMintedTokens(data, tokens, isDependentCreator)
      .then((values) => {
        renderToast(toastId, 'The transaction has succeeded.');
        values &&
          console.log(
            `The transaction has succeeded.\n${values} token${values > 1 ? 's' : ''} ${
              values > 1 ? 'have' : 'has'
            } been minted`
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
        setIsMintingTokens(false);
        setTokens(null);
      });
  }

  return (
    <div className={styles.layoutFit}>
      <div className={styles.header}>
        <h1>{`Mint${tokenName ? ' '.concat(tokenName) : ''}`}</h1>
        <button className={styles.closeBtn} onClick={handleCancel}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.form}>
          <Formik
            initialValues={initialValues}
            onSubmit={(values, resetForm) => handleFormSubmit(values, resetForm)}
            enableReinitialize
          >
            {({ values: { tokenId, tokenTypeId, tokenAmount, fields }, resetForm, setFieldValue }) => {
              const isIndependentformSubmitBtnDisabled = !(
                tokenId &&
                tokenId.length &&
                tokenTypeId &&
                tokenAmount &&
                tokenAmount.length
              );
              const isDependentformSubmitBtnDisabled = !(
                batchFields &&
                batchFields.tokenId &&
                batchFields.tokenId.length > 0 &&
                batchFields.tokenTypeId &&
                batchFields.tokenTypeId.value.length > 0 &&
                batchFields.tokenAmount &&
                batchFields.tokenAmount.length > 0 &&
                Object.values(fields)
                  .map(({ data }) => data && data.map(({ id, amount }) => amount.length > 0 && id && id.length > 0))
                  .flat()
                  .reduce((acc, next) => acc && next, true)
              );
              const instructions =
                tokenTypesRecords &&
                batchFields &&
                batchFields.tokenTypeId &&
                Object.keys(tokenTypesRecords).includes(batchFields.tokenTypeId.value)
                  ? tokenTypesRecords[batchFields.tokenTypeId.value as keyof typeof tokenTypesRecords].instructions
                  : null;
              return (
                <Form>
                  <div className={styles.field}>
                    {isDependentCreator && tokenTypeOptions ? (
                      <>
                        <Label htmlFor={'tokenTypeId'}>Type Id *</Label>
                        <Dropdown
                          instanceId="tokenTypeId"
                          handleOnChange={(option: IItem | null) =>
                            setBatchFields((prev) =>
                              option ? { ...prev, tokenTypeId: option } : { ...prev, tokenTypeId: null }
                            )
                          }
                          value={batchFields ? batchFields.tokenTypeId ?? null : null}
                          options={tokenTypeOptions}
                          borderWidth="2px"
                          borderColor="var(--gray-400)"
                          borderColorHover="#000"
                          placeholderColor="var(--gray-400)"
                          isClearable
                        />
                        <ErrorMessage name="tokenTypeId" component="div" className={styles.fieldError} />
                      </>
                    ) : (
                      <>
                        <Label htmlFor={'tokenTypeId'}>Type Id *</Label>
                        <Field
                          name="tokenTypeId"
                          validate={(value: string) => handleStringValidation(value, 'type id')}
                        />
                        <ErrorMessage name="tokenTypeId" component="div" className={styles.fieldError} />
                      </>
                    )}
                  </div>
                  <div className={styles.fieldSm}>
                    <Label htmlFor={'tokenId'}>Batch Id *</Label>
                    {isDependentCreator ? (
                      <input
                        name="tokenId"
                        type="text"
                        onBlur={undefined}
                        value={batchFields ? batchFields.tokenId ?? '' : ''}
                        onChange={(value) => setBatchFields((prev) => ({ ...prev, tokenId: value.target.value }))}
                      />
                    ) : (
                      <>
                        <Field name="tokenId" validate={(value: string) => handleStringValidation(value, 'batch id')} />
                        <ErrorMessage name={'tokenId'} component="div" className={styles.fieldError} />
                      </>
                    )}
                  </div>
                  <div className={styles.fieldSm}>
                    <Label htmlFor="tokenAmount">{`Amount (${getTokenUnitFromModule(moduleId)}) *`}</Label>
                    {isDependentCreator ? (
                      <input
                        name="tokenAmount"
                        type="text"
                        onBlur={undefined}
                        value={batchFields ? batchFields.tokenAmount ?? '' : ''}
                        onChange={(value) => setBatchFields((prev) => ({ ...prev, tokenAmount: value.target.value }))}
                      />
                    ) : (
                      <>
                        <Field name={'tokenAmount'} validate={handleAmountValidation} />
                        <ErrorMessage name={'tokenAmount'} component="div" className={styles.fieldError} />
                      </>
                    )}
                  </div>
                  {isDependentCreator &&
                    instructions &&
                    instructions.map(({ id, title, amount, certifiedTokenTypes, instructorModuleId }) => {
                      const instructionType_s: string[] = certifiedTokenTypes
                        ? certifiedTokenTypes.map((type) => type.id)
                        : [id];
                      const batchIdOpts = inputTokenGroupedOptionsFiltered(instructionType_s);

                      return (
                        <FieldArray key={id} name={`fields.${id}.data`}>
                          {({ remove, push }) => {
                            const neededAmount =
                              amount && instructorModuleId && batchFields && batchFields.tokenAmount
                                ? isOliveOilMill(instructorModuleId)
                                  ? (amount * parseInt(batchFields.tokenAmount)) / 1000
                                  : amount * parseInt(batchFields.tokenAmount)
                                : null;
                            const totalAmount = Object.keys(fields).includes(id)
                              ? fields[id].data
                                  .map(({ amount }) => {
                                    return amount.length > 0 ? parseInt(amount) : 0;
                                  })
                                  .flat()
                                  .reduce((acc, current) => acc + current, 0)
                              : 0;
                            return (
                              <div className={styles.fieldArray}>
                                {<p className={styles.title}>{title ? title : id}</p>}
                                {instructorModuleId && neededAmount && (
                                  <p
                                    className={styles.note}
                                  >{`(An exact total amount of ${neededAmount.toString()} ${getTokenUnitFromModule(
                                    instructorModuleId
                                  )} is needed)`}</p>
                                )}
                                {Object.keys(fields).includes(id) &&
                                  fields[id].data.map(({}, index) => (
                                    <div key={index} className={styles.fieldBtnPairMargin}>
                                      <div className={styles.fieldArrayMultiInput}>
                                        <div className={styles.field}>
                                          <Label htmlFor={`fields.${id}.data.${index}.id`}>{`Batch Id ${
                                            index + 1
                                          } *`}</Label>
                                          <Field
                                            name={`fields.${id}.data.${index}.id`}
                                            component={GroupedTokensDropdownFiltered}
                                            options={batchIdOpts}
                                            validate={(value: string | null) =>
                                              handleSelectValidation(value, 'input token id')
                                            }
                                          />
                                          <ErrorMessage
                                            name={`fields.${id}.data.${index}.id`}
                                            component="div"
                                            className={styles.fieldError}
                                          />
                                        </div>
                                        <div className={styles.field}>
                                          <Label htmlFor={`fields.${id}.data.${index}.amount`}>
                                            Amount
                                            {instructorModuleId && ` (${getTokenUnitFromModule(instructorModuleId)})`} *
                                          </Label>
                                          <Field name={`fields.${id}.data.${index}.amount`} />
                                          <ErrorMessage
                                            name={`fields.${id}.data.${index}.amount`}
                                            component="div"
                                            className={styles.fieldError}
                                          />
                                        </div>
                                      </div>
                                      {batchFields &&
                                        batchFields.tokenAmount &&
                                        batchFields.tokenAmount.length > 0 &&
                                        index === fields[id].data.length - 1 && (
                                          <button
                                            type="button"
                                            disabled={neededAmount === totalAmount}
                                            onClick={() => {
                                              neededAmount &&
                                                setFieldValue(
                                                  `fields.${id}.data.${index}.amount`,
                                                  (fields[id].data.length === 1
                                                    ? neededAmount
                                                    : neededAmount === totalAmount
                                                    ? 0
                                                    : neededAmount - totalAmount
                                                  ).toString()
                                                );
                                            }}
                                          >
                                            <SVG icon={AiFillCaretDown} />
                                          </button>
                                        )}
                                      <button
                                        type="button"
                                        disabled={fields[id].data.length < 2}
                                        onClick={() => remove(index)}
                                      >
                                        <SVG icon={BsTrash} />
                                      </button>
                                    </div>
                                  ))}
                                <div className={styles.addField}>
                                  <button
                                    type="button"
                                    onClick={() => push({ id: null, amount: '' })}
                                    disabled={
                                      Boolean(
                                        batchIdOpts &&
                                          Object.keys(fields).includes(id) &&
                                          fields[id].data.length === batchIdOpts.length
                                      ) || neededAmount === totalAmount
                                    }
                                  >
                                    Add batch
                                  </button>
                                </div>
                              </div>
                            );
                          }}
                        </FieldArray>
                      );
                    })}
                  <div className={styles.formSubmit}>
                    <button
                      disabled={
                        isDependentCreator ? isDependentformSubmitBtnDisabled : isIndependentformSubmitBtnDisabled
                      }
                      type="submit"
                    >
                      Add to the list
                    </button>
                    <button
                      type="submit"
                      onClick={() => {
                        setBatchFields(null);
                        resetForm();
                      }}
                    >
                      Reset form
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
        {tokens && tokens.length > 0 && (
          <div className={styles.carousel}>
            <Carousel responsive={carouselResponsive}>
              {tokens.map((token) => {
                return (
                  <IdentifierTypeAmountCard
                    key={token.tokenId}
                    moduleId={moduleId}
                    handleDelToken={handleDelToken}
                    {...token}
                  />
                );
              })}
            </Carousel>
          </div>
        )}
        <div className={styles.actionBtns}>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={!(tokens && tokens.length > 0)}>
            Mint
          </button>
          <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default MintTokens;

const GroupedTokensDropdownFiltered: FC<OptionProps<any> & FieldProps> = ({ form, field, options }): JSX.Element => {
  const { values } = useFormikContext();
  const fields = (values as IFormikMintToken).fields;
  const fieldKeys = Object.keys(fields);
  const selectedIds: string[] = [];
  for (let i = 0; i < fieldKeys.length; i++) {
    const key = fieldKeys[i];
    for (let j = 0; j < fields[key as keyof typeof fields].data.length; j++) {
      const fieldKey = fields[key as keyof typeof fields].data[j].id;
      if (fieldKey) {
        selectedIds.push(fieldKey);
      }
    }
  }
  const filteredOpts =
    options &&
    (options as IGroupedItems[]).map<IGroupedItems>((group) => {
      return {
        label: group.label,
        options: group.options.filter((item) => selectedIds && !selectedIds.flat().includes(item.value))
      };
    });
  const value = options
    ? options
        .map((options) => options.options)
        .flat()
        .find((option) => option.value === field.value)
    : null;

  return (
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
      isSearchable
    />
  );
};
