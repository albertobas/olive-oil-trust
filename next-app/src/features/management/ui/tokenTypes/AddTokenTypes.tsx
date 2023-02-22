import { useState, useMemo, Dispatch, SetStateAction, useCallback } from 'react';
import styles from 'next-app/src/features/shared/styles/modules/forms/Form.module.css';
import { IGroupedItems, IItem, Role } from 'next-app/src/features/shared/utils/interfaces';
import { Formik, Form, Field, FieldArray, FormikHelpers, ErrorMessage } from 'formik';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { ICertificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { Root as Label } from '@radix-ui/react-label';
import TokenTypesDropdownFiltered from 'next-app/src/features/shared/ui/tokenTypes/TokenTypesDropdownFiltered';
import { IAddTokenTypeState, IFormikTokenType } from 'next-app/src/features/management/utils/interfaces';
import { toast } from 'react-toastify';
import TokenTypeMiniCard from 'next-app/src/features/management/ui/tokenTypes/TokenTypeMiniCard';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import {
  getInstuctionTokenUnitFromRole,
  getModuleFromRole,
  getTokenNameFromModule,
  transferTokenTypes
} from 'next-app/src/features/management/utils/helpers';
import { FaTimes } from 'react-icons/fa';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { BsTrash } from 'react-icons/bs';
import Carousel from 'react-multi-carousel';
import { handleSelectValidation } from 'next-app/src/features/shared/ui/utils/helpers';
import { renderToast } from 'next-app/src/shared/utils/helpers';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import { handleAmountValidation } from 'next-app/src/features/management/utils/helpers';
import { Module } from 'next-app/src/shared/utils/interfaces';
import { carouselResponsive } from 'next-app/src/features/management/utils/constants';

type Props = {
  previousTokenTypes: ITokenType[] | null;
  certificates: ICertificate[] | null;
  setIsAddingTokenTypes: Dispatch<SetStateAction<boolean>>;
};

function AddTokenTypes({ previousTokenTypes, certificates, setIsAddingTokenTypes }: Props): JSX.Element {
  const [tokenTypes, setTokenTypes] = useState<IAddTokenTypeState[] | null>(null);

  const { error, data } = useSignedMemberContract();

  const accountState = useAppSelector((state) => state.account);

  const tokenTypesOrCertificates = useMemo(() => {
    if (previousTokenTypes || certificates) {
      const types: Record<
        string,
        { contract: string | null; identifier: string; role: Role | null; title: string | null }
      > = {};
      if (previousTokenTypes && previousTokenTypes.length > 0) {
        previousTokenTypes.forEach(
          (type) =>
            (types[type.id] = {
              contract: type.contract,
              identifier: type.identifier,
              role: type.member ? type.member.role : null,
              title: type.metadata ? type.metadata.title : null
            })
        );
      }
      if (certificates && certificates.length > 0) {
        certificates.forEach(
          (certificate) =>
            (types[certificate.id] = {
              contract: certificate.contract,
              identifier: certificate.identifier,
              role: certificate.tokenTypes ? certificate.tokenTypes[0].member?.role ?? null : null,
              title: certificate.metadata ? certificate.metadata.title : null
            })
        );
      }
      return types;
    }
    return null;
  }, [certificates, previousTokenTypes]);

  const options = useMemo<IGroupedItems[] | null>(() => {
    const getItems = (data: (ITokenType | ICertificate)[]): IItem[] => {
      return data.map(({ metadata, id, identifier }) => {
        return { label: `${identifier}${metadata && metadata.title && ` - ${metadata.title}`}`, value: id };
      });
    };
    const tokenTypesGroup = previousTokenTypes ? { label: 'Token types', options: getItems(previousTokenTypes) } : null;
    const certificatesGroup = certificates ? { label: 'Certificates', options: getItems(certificates) } : null;
    return tokenTypesGroup && certificatesGroup
      ? [tokenTypesGroup, certificatesGroup]
      : tokenTypesGroup
      ? [tokenTypesGroup]
      : certificatesGroup
      ? [certificatesGroup]
      : null;
  }, [certificates, previousTokenTypes]);

  const handleTokenTypeIdValidation = useCallback(
    (value: string | null) => {
      const tokenTypesIds: string[] | null = tokenTypes ? tokenTypes.map((type) => type.id) : null;
      if (value && tokenTypesIds && tokenTypesIds.includes(value)) {
        return 'This id has already been added';
      }
      return null;
    },
    [tokenTypes]
  );

  if (
    !accountState.data ||
    !(accountState.data && accountState.data.contract) ||
    !(accountState.data && accountState.data.contract.moduleId)
  ) {
    return <></>;
  }

  const { moduleId } = accountState.data.contract;

  if (error) {
    return (
      <div className={styles.layoutFit}>
        <div className={styles.header}>
          <h1>{`Add ${getTokenNameFromModule(moduleId)} Types`}</h1>
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

  function handleSubmit() {
    const toastId = toast.loading('Waiting for wallet response...');
    transferTokenTypes(data, tokenTypes)
      .then((values) => {
        renderToast(toastId, 'The transaction has succeeded.');
        values &&
          console.log(`The transaction has succeeded.\n${values} token type${values > 1 ? 's' : ''} have been created`);
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
        setIsAddingTokenTypes(false);
        setTokenTypes(null);
      });
  }

  function handleCancel() {
    setIsAddingTokenTypes(false);
    setTokenTypes(null);
  }

  function handleDelTokenType(id: string) {
    if (tokenTypes) {
      if (tokenTypes.length == 1) {
        setTokenTypes(null);
      } else {
        setTokenTypes((prevState) => {
          return prevState && prevState.filter((type) => type.id != id);
        });
      }
    }
  }

  function handleFormSubmit({ fieldArray, ...rest }: IFormikTokenType, { resetForm }: FormikHelpers<IFormikTokenType>) {
    if (tokenTypesOrCertificates) {
      const instructedAddresses: string[] = [];
      const instructedIds: string[] = [];
      const instructedAmounts: number[] = [];
      const instructedTypeModules: Module[] = [];
      const instructedTitles: (string | null)[] = [];
      for (let i = 0; i < fieldArray.length; i++) {
        const { id, amount } = fieldArray[i];
        if (id && amount.length) {
          const contractAddr = tokenTypesOrCertificates[id].contract;
          instructedIds.push(tokenTypesOrCertificates[id].identifier);
          if (contractAddr) {
            instructedAddresses.push(contractAddr);
          }
          const instructionRoleId =
            tokenTypesOrCertificates && Object.keys(tokenTypesOrCertificates).includes(id)
              ? tokenTypesOrCertificates[id as keyof typeof tokenTypesOrCertificates].role
              : null;
          const instructionModuleId = instructionRoleId ? getModuleFromRole(instructionRoleId) : null;
          instructedAmounts.push(parseInt(amount));
          instructionModuleId && instructedTypeModules.push(instructionModuleId);

          instructedTitles.push(tokenTypesOrCertificates[id].title);
        }
      }
      const tokenType = {
        instructedAddresses,
        instructedIds,
        instructedAmounts,
        instructedTitles,
        instructedTypeModules,
        ...rest
      };
      setTokenTypes((prevState) => {
        if (prevState) {
          prevState.push(tokenType);
          return [...prevState];
        }
        return [tokenType];
      });
      resetForm();
    }
  }

  const initialValues: IFormikTokenType = {
    id: '',
    fieldArray: [{ id: null, amount: '' }]
  };

  return (
    <div className={`${styles.layout} ${styles.minH50}`}>
      <div className={styles.header}>
        <h1>{`Add ${getTokenNameFromModule(moduleId)} Types`}</h1>
        <button className={styles.closeBtn} onClick={handleCancel}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.formBtns}>
          <div className={styles.form}>
            <Formik initialValues={initialValues} onSubmit={(values, resetForm) => handleFormSubmit(values, resetForm)}>
              {({ values, resetForm }) => {
                const { id, fieldArray } = values;
                const isFormSubmitBtnDisabled = !(
                  id.length > 0 &&
                  fieldArray &&
                  fieldArray.length > 0 &&
                  fieldArray[0].id !== null &&
                  fieldArray[0].amount.length > 0
                );
                const isRemoveBtnDisabled = values.fieldArray.length === 1;

                return (
                  <Form>
                    <div className={styles.field}>
                      <Label htmlFor="id">Token Type Id *</Label>
                      <Field name="id" validate={handleTokenTypeIdValidation} />
                      <ErrorMessage name="id" component="div" className={styles.fieldError} />
                    </div>
                    {values.fieldArray.length > 0 && (
                      <FieldArray name="fieldArray">
                        {({ remove, push }) => (
                          <div className={styles.fieldArray}>
                            <p className={styles.title}>Instructions</p>
                            {values.fieldArray.map((field, index) => {
                              const fieldRole =
                                field &&
                                field.id &&
                                tokenTypesOrCertificates &&
                                Object.keys(tokenTypesOrCertificates).includes(field.id)
                                  ? tokenTypesOrCertificates[field.id as keyof typeof tokenTypesOrCertificates].role
                                  : null;
                              return (
                                <div key={index} className={styles.fieldBtnPair}>
                                  <div className={styles.fieldArrayMultiInputMargin}>
                                    <div className={styles.field}>
                                      <Label htmlFor={`fieldArray.${index}.id`}>Id *</Label>
                                      <Field
                                        name={`fieldArray.${index}.id`}
                                        component={TokenTypesDropdownFiltered}
                                        options={options}
                                        validate={(value: string | null) =>
                                          handleSelectValidation(value, 'token type id')
                                        }
                                      />
                                      <ErrorMessage
                                        name={`fieldArray.${index}.id`}
                                        component="div"
                                        className={styles.fieldError}
                                      />
                                    </div>
                                    <div className={styles.field}>
                                      <Label htmlFor={`fieldArray.${index}.amount`}>
                                        Amount{fieldRole && ` (${getInstuctionTokenUnitFromRole(fieldRole)})`} *
                                      </Label>
                                      <Field name={`fieldArray.${index}.amount`} validate={handleAmountValidation} />
                                      <ErrorMessage
                                        name={`fieldArray.${index}.amount`}
                                        component="div"
                                        className={styles.fieldError}
                                      />
                                    </div>
                                  </div>
                                  <button type="button" disabled={isRemoveBtnDisabled} onClick={() => remove(index)}>
                                    <SVG icon={BsTrash} />
                                  </button>
                                </div>
                              );
                            })}
                            <div className={styles.addField}>
                              <button type="button" onClick={() => push({ id: null, amount: '' })}>
                                Add instruction
                              </button>
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    )}
                    <div className={styles.formSubmit}>
                      <button disabled={isFormSubmitBtnDisabled} type="submit">
                        Add to the list
                      </button>
                      <button type="submit" onClick={() => resetForm()}>
                        Reset form
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
          {tokenTypes && tokenTypes.length > 0 && (
            <div className={styles.carousel}>
              <Carousel responsive={carouselResponsive}>
                {tokenTypes.map((type) => (
                  <TokenTypeMiniCard key={type.id} handleDelTokenType={handleDelTokenType} {...type} />
                ))}
              </Carousel>
            </div>
          )}
        </div>
        <div className={styles.actionBtns}>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={!(tokenTypes && tokenTypes.length > 0)}>
            Add
          </button>
          <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTokenTypes;
