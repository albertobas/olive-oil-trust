import { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import { IGroupedItems, IItem } from 'next-app/src/features/shared/utils/interfaces';
import { IFormikPackToken, IPackTokenState } from 'next-app/src/features/management/utils/interfaces';
import { toast } from 'react-toastify';
import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import { Formik, Form, Field, FieldArray, FormikHelpers, ErrorMessage, useFormikContext, FieldProps } from 'formik';
import PackTokenCard from 'next-app/src/features/management/ui/tokens/PackTokenCard';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import {
  getGroupedTokensByType,
  handleAmountValidation,
  transferPackTokens
} from 'next-app/src/features/management/utils/helpers';
import { renderToast } from 'next-app/src/shared/utils/helpers';
import { Root as Label } from '@radix-ui/react-label';
import styles from 'next-app/src/features/shared/styles/modules/forms/Form.module.css';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { FaTimes } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import Carousel from 'react-multi-carousel';
import Dropdown from 'next-app/src/features/shared/ui/dropdown/Dropdown';
import { OptionProps } from 'react-select';
import { carouselResponsive } from 'next-app/src/features/management/utils/constants';
import { handleSelectValidation } from '../../../shared/ui/utils/helpers';

type Props = {
  commercialTokens: IToken[];
  isDistributor: boolean;
  setIsPackingTokens: Dispatch<SetStateAction<boolean>>;
};

function PackTokens({ isDistributor, commercialTokens, setIsPackingTokens }: Props): JSX.Element {
  const [tokens, setTokens] = useState<IPackTokenState[] | null>(null);
  const { error, data } = useSignedMemberContract();

  const tokensRecords = useMemo(() => {
    if (commercialTokens.length > 0) {
      const tokens: Record<string, { identifier: string; contract: string; type: string | null }> = {};
      commercialTokens.forEach(
        (token) =>
          (tokens[token.id] = {
            identifier: token.identifier,
            contract: token.contract,
            type: token.tokenType ? token.tokenType.identifier : null
          })
      );
      return tokens;
    }
    return null;
  }, [commercialTokens]);

  const contentOptions: IGroupedItems[] | null = useMemo(() => {
    if (commercialTokens) {
      return getGroupedTokensByType(
        isDistributor ? commercialTokens : commercialTokens.filter((token) => token.selfProduced)
      );
    }
    return null;
  }, [commercialTokens, isDistributor]);

  if (error) {
    return (
      <div className={styles.layoutFit}>
        <div className={styles.header}>
          <h1>Pack Tokens</h1>
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
    setIsPackingTokens(false);
    setTokens(null);
  }

  function handleFormSubmit({ packId, fieldArray }: IFormikPackToken, { resetForm }: FormikHelpers<IFormikPackToken>) {
    if (tokensRecords) {
      const tokenAddresses: string[] = [];
      const tokenTypeIds: (string | null)[] = [];
      const tokenIds: string[] = [];
      const tokenAmounts: number[] = [];
      for (let i = 0; i < fieldArray.length; i++) {
        const tokenId = fieldArray[i].id;
        const tokenAmount = parseInt(fieldArray[i].amount);
        if (tokenId) {
          tokenAddresses.push(tokensRecords[tokenId].contract);
          tokenTypeIds.push(tokensRecords[tokenId].type);
          tokenIds.push(tokensRecords[tokenId].identifier);
          tokenAmounts.push(tokenAmount);
        }
      }
      const token = { packId, tokenAddresses, tokenTypeIds, tokenIds, tokenAmounts };
      setTokens((prevState) => {
        if (prevState) {
          prevState.push(token);
          return [...prevState];
        }
        return [token];
      });
      resetForm();
    }
  }

  function handleDelToken(id: string) {
    if (tokens) {
      if (tokens.length == 1) {
        setTokens(null);
      } else {
        setTokens((prevState) => {
          return prevState && prevState.filter((token) => token.packId != id);
        });
      }
    }
  }

  function handleSubmit() {
    const toastId = toast.loading('Waiting for wallet response...');
    transferPackTokens(data, tokens, isDistributor)
      .then((numTokens) => {
        renderToast(toastId, 'The transaction has succeeded.');
        numTokens &&
          console.log(
            `The transaction has succeeded.\n${numTokens} industrial unit${numTokens > 1 ? 's' : ''} ${
              numTokens > 1 ? 'have' : 'has'
            } been packed`
          );
      })
      .catch((error) => {
        renderToast(toastId, 'The transaction has failed.', error);
        console.error(
          `The transaction has failed.${error.code ? `\nError code: ${error.code}\nError message: ` : ''}${
            error.message
          }`
        );
      })
      .finally(() => {
        setIsPackingTokens(false);
        setTokens(null);
      });
  }

  const initialValues: IFormikPackToken = {
    packId: '',
    fieldArray: [{ id: null, amount: '' }]
  };

  return (
    <div className={`${styles.layout} ${styles.minH60}`}>
      <div className={styles.header}>
        <h1>Pack Tokens</h1>
        <button className={styles.closeBtn} onClick={handleCancel}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.form}>
          <Formik initialValues={initialValues} onSubmit={(values, resetForm) => handleFormSubmit(values, resetForm)}>
            {({ values, resetForm }) => {
              const { fieldArray } = values;

              return (
                <Form>
                  <div className={styles.field}>
                    <Label htmlFor="packId">Pallet Id *</Label>
                    <Field name="packId" />
                    <ErrorMessage name="packId" component="div" className={styles.fieldError} />
                  </div>
                  {fieldArray.length > 0 && (
                    <FieldArray name="fieldArray">
                      {({ remove, push }) => (
                        <div className={styles.fieldArray}>
                          <p className={styles.title}>Content</p>
                          {fieldArray.map(({}, index) => (
                            <div key={index} className={styles.fieldBtnPair}>
                              <div className={styles.fieldArrayMultiInputMargin}>
                                <div className={styles.field}>
                                  <Label htmlFor={`fieldArray.${index}.id`}>{`Batch Id *`}</Label>
                                  <Field
                                    name={`fieldArray.${index}.id`}
                                    placeholder="placeholder"
                                    type="text"
                                    component={PackDropdown}
                                    options={contentOptions}
                                    validate={(value: string | null) => handleSelectValidation(value, 'batch id')}
                                  />
                                  <ErrorMessage
                                    name={`fieldArray.${index}.id`}
                                    component="div"
                                    className={styles.fieldError}
                                  />
                                </div>
                                <div className={styles.field}>
                                  <Label htmlFor={`fieldArray.${index}.amount`}>Amount *</Label>
                                  <Field name={`fieldArray.${index}.amount`} validate={handleAmountValidation} />
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
                    <button type="submit">Add to the list</button>
                    <button type="submit" onClick={() => resetForm()}>
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
                return <PackTokenCard key={token.packId} handleDelToken={handleDelToken} {...token} />;
              })}
            </Carousel>
          </div>
        )}
        <div className={styles.actionBtns}>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={!(tokens && tokens.length > 0)}>
            Pack
          </button>
          <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default PackTokens;

const PackDropdown: FC<OptionProps<any> & FieldProps> = ({ form: { setFieldValue }, field, options }): JSX.Element => {
  const { values } = useFormikContext();
  const { fieldArray } = values as IFormikPackToken;
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
