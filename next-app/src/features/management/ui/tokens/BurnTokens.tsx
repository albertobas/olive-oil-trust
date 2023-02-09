import { Dispatch, FC, SetStateAction, useMemo } from 'react';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import useSignedContract from 'next-app/src/features/shared/ui/hooks/useSignedContract';
import { IBurnTokenState, IFormikBurnToken } from 'next-app/src/features/management/utils/interfaces';
import { toast } from 'react-toastify';
import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import { Root as Label } from '@radix-ui/react-label';
import { Formik, Form, Field, ErrorMessage, FieldArray, useFormikContext, FieldProps } from 'formik';
import styles from 'next-app/src/features/shared/styles/modules/forms/Form.module.css';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { getGroupedTokensByType, transferBurnTokens } from 'next-app/src/features/management/utils/helpers';
import { FaTimes } from 'react-icons/fa';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { renderToast } from 'next-app/src/shared/utils/helpers';
import { Module } from 'next-app/src/shared/utils/interfaces';
import { IGroupedItems, IItem } from 'next-app/src/features/shared/utils/interfaces';
import { isSeller } from 'next-app/src/shared/utils/constants';
import { OptionProps } from 'react-select';
import Dropdown from 'next-app/src/features/shared/ui/dropdown/Dropdown';
import { BsTrash } from 'react-icons/bs';

type Props = {
  commercialTokens: IToken[];
  accountAddress?: string;
  moduleId?: Module;
  setIsBurningTokens: Dispatch<SetStateAction<boolean>>;
};

type TokenRecord = Record<string, { identifier: string; contract: string; type: string }>;

function BurnTokens({ commercialTokens, moduleId, accountAddress, setIsBurningTokens }: Props): JSX.Element {
  const { error, data } = useSignedMemberContract();
  const signedEscrowContract = useSignedContract(
    commercialTokens.length
      ? commercialTokens[0].tokenType?.member?.name?.replace(/ /g, '') + 'OliveOilBottle' ?? null
      : null
  );
  const tokensRecords = useMemo<TokenRecord | null>(() => {
    if (commercialTokens.length > 0) {
      const tokenRecord: TokenRecord = {};
      for (let i = 0; i < commercialTokens.length; i++) {
        const { id, identifier, contract, tokenType } = commercialTokens[i];
        if (tokenType) {
          tokenRecord[id] = { identifier, contract, type: tokenType.identifier };
        }
      }
      return tokenRecord;
    }
    return null;
  }, [commercialTokens]);

  const contentOptions = useMemo<IGroupedItems[] | null>(() => {
    if (commercialTokens) {
      return getGroupedTokensByType(commercialTokens);
    }
    return null;
  }, [commercialTokens]);

  if ((moduleId && error) || (!moduleId && signedEscrowContract.error)) {
    return (
      <div className={styles.layoutFit}>
        <div className={styles.header}>
          <h1>Burn Tokens</h1>
          <button className={styles.closeBtn} onClick={handleCancel}>
            <SVG icon={FaTimes} />
          </button>
        </div>
        <FallbackMessage message="An abstraction of the contract could not be created" error />
      </div>
    );
  }

  if ((moduleId && !data) || (!moduleId && !signedEscrowContract.data)) {
    // loading
    return <FallbackMessage />;
  }

  function handleCancel() {
    setIsBurningTokens(false);
  }

  function handleSubmit({ fieldArray }: IFormikBurnToken) {
    const toastId = toast.loading('Waiting for wallet response...');
    let tokens: IBurnTokenState[] | null = null;
    if (tokensRecords) {
      tokens = [];
      for (let i = 0; i < fieldArray.length; i++) {
        const { id, amount } = fieldArray[i];
        if (id) {
          const tokenAddress = tokensRecords[id].contract;
          const tokenTypeId = tokensRecords[id].type;
          const tokenIdentifier = tokensRecords[id].identifier;
          tokens.push({
            tokenAddress,
            tokenTypeId,
            tokenId: id,
            tokenIdentifier,
            tokenAmount: parseInt(amount)
          });
        }
      }
    }
    const isSeller_ = Boolean(moduleId && isSeller(moduleId));
    const contract = moduleId ? data : signedEscrowContract.data;
    transferBurnTokens(contract, tokens, isSeller_, accountAddress)
      .then((numTokens) => {
        renderToast(toastId, 'The transaction has succeeded.');
        console.log(
          `The transaction has succeeded.\n${
            numTokens &&
            `${numTokens} commercial token${numTokens > 1 ? 's' : ''} ${numTokens > 1 ? 'have' : 'has'} been burnt`
          }`
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
        setIsBurningTokens(false);
      });
  }

  const initialValues: IFormikBurnToken = {
    fieldArray: [{ id: null, amount: '' }]
  };

  return (
    <div className={`${styles.layout} ${styles.minH30}`}>
      <div className={styles.header}>
        <h1>Burn Tokens</h1>
        <button className={styles.closeBtn} onClick={handleCancel}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <div className={styles.content}>
        <div>
          <div className={styles.form}>
            <Formik initialValues={initialValues} onSubmit={(values) => handleSubmit(values)}>
              {({ values, resetForm }) => {
                const { fieldArray } = values;
                return (
                  <Form>
                    {fieldArray.length > 0 && (
                      <FieldArray name="fieldArray">
                        {({ remove, push }) => (
                          <div className={styles.fieldArray}>
                            <p className={styles.title}>Tokens</p>
                            {fieldArray.map(({}, index) => (
                              <div key={index} className={styles.fieldBtnPair}>
                                <div className={styles.fieldArrayMultiInputMargin}>
                                  <div className={styles.field}>
                                    <Label htmlFor={`fieldArray.${index}.id`}>{`Id *`}</Label>
                                    <Field
                                      name={`fieldArray.${index}.id`}
                                      placeholder="placeholder"
                                      type="text"
                                      component={BurnDropdown}
                                      options={contentOptions}
                                    />
                                    <ErrorMessage
                                      name={`fieldArray.${index}.id`}
                                      component="div"
                                      className={styles.fieldError}
                                    />
                                  </div>
                                  <div className={styles.field}>
                                    <Label htmlFor={`fieldArray.${index}.amount`}>Amount *</Label>
                                    <Field name={`fieldArray.${index}.amount`} />
                                    <ErrorMessage
                                      name={`fieldArray.${index}.amount`}
                                      component="div"
                                      className={styles.fieldError}
                                    />
                                  </div>
                                </div>
                                <button type="button" onClick={() => remove(index)} disabled={fieldArray.length === 1}>
                                  <SVG icon={BsTrash} />
                                </button>
                              </div>
                            ))}
                            <div className={styles.addField}>
                              <button
                                type="button"
                                onClick={() => push({ id: null, amount: '' })}
                                disabled={Boolean(
                                  contentOptions?.map((options) => options.options).flat().length === fieldArray.length
                                )}
                              >
                                Add token
                              </button>
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    )}
                    <div className={styles.formSubmit}>
                      <button type="reset" onClick={() => resetForm()}>
                        Reset form
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
        <div className={styles.actionBtns}>
          <button type="submit" className={styles.submitBtn}>
            Burn
          </button>
          <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default BurnTokens;

const BurnDropdown: FC<OptionProps<any> & FieldProps> = ({ form: { setFieldValue }, field, options }): JSX.Element => {
  const { values } = useFormikContext();
  const { fieldArray } = values as IFormikBurnToken;
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
    ? (options as IGroupedItems[])
        .map((options) => options.options)
        .flat()
        .find((item) => item.value === field.value) ?? null
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
