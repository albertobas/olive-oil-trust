import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import styles from 'next-app/src/features/shared/styles/modules/forms/Form.module.css';
import { IGroupedItems } from 'next-app/src/features/shared/utils/interfaces';
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import { Root as Label } from '@radix-ui/react-label';
import { ICertifyTokenTypeState, IFormikCertificate } from 'next-app/src/features/management/utils/interfaces';
import { ITokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { toast } from 'react-toastify';
import {
  getGroupedTokenTypesByRole,
  transferCertifiedTokenTypes
} from 'next-app/src/features/management/utils/helpers';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { FaTimes } from 'react-icons/fa';
import Carousel from 'react-multi-carousel';
import CertifyTokenTypesCard from 'next-app/src/features/management/ui/certificates/CertifyTokenTypesCard';
import { renderToast } from 'next-app/src/shared/utils/helpers';
import { carouselResponsive } from 'next-app/src/features/management/utils/constants';
import { handleSelectValidation } from 'next-app/src/features/shared/ui/utils/helpers';
import TokenTypesDropdownMulti from 'next-app/src/features/shared/ui/tokenTypes/TokenTypesDropdownMulti';

type Props = {
  tokenTypes: ITokenType[];
  setIsAddingCertificates: Dispatch<SetStateAction<boolean>>;
};

function CertifyTokenTypes({ tokenTypes, setIsAddingCertificates }: Props): JSX.Element {
  const { error, data } = useSignedMemberContract();
  const [certificates, setCertificates] = useState<ICertifyTokenTypeState[] | null>(null);

  const tokenTypesRecords = useMemo(() => {
    if (tokenTypes.length > 0) {
      const tokenTypes_: Record<string, { identifier: string; contract: string | null; title: string }> = {};
      tokenTypes.forEach(
        ({ id, identifier, contract, metadata }) =>
          (tokenTypes_[id] = {
            identifier,
            contract,
            title: metadata && metadata.title ? `${identifier} (${metadata.title})` : identifier
          })
      );
      return tokenTypes_;
    }
    return null;
  }, [tokenTypes]);

  const options: IGroupedItems[] | null = useMemo(() => {
    if (tokenTypes) {
      return getGroupedTokenTypesByRole(tokenTypes);
    }
    return null;
  }, [tokenTypes]);

  if (error) {
    return (
      <div className={styles.layoutFit}>
        <div className={styles.header}>
          <h1>Certify Token Types</h1>
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

  function handleFormSubmit({ ids, ...rest }: IFormikCertificate, { resetForm }: FormikHelpers<IFormikCertificate>) {
    const tokenAddresses: string[] = [];
    const tokenTypeIds: string[] = [];
    const tokenTypeTitles: string[] = [];
    if (tokenTypesRecords && ids) {
      for (let i = 0; i < ids.length; i++) {
        const tokenTypeId = ids[i];
        if (tokenTypeId) {
          const contract = tokenTypesRecords[tokenTypeId].contract;
          if (contract) {
            tokenAddresses.push(contract);
          }
          tokenTypeIds.push(tokenTypesRecords[tokenTypeId].identifier);
          tokenTypeTitles.push(tokenTypesRecords[tokenTypeId].title);
        }
      }
    }
    const certificate = {
      tokenTypeIds,
      tokenAddresses,
      tokenTypeTitles,
      ...rest
    };
    setCertificates((prevState) => {
      if (prevState) {
        prevState.push(certificate);
        return [...prevState];
      }
      return [certificate];
    });
    resetForm();
  }

  function handleSubmit() {
    const toastId = toast.loading('Waiting for wallet response...');
    transferCertifiedTokenTypes(data, certificates)
      .then((numCertificates) => {
        renderToast(toastId, 'The transaction has succeeded.');
        console.log(
          `The transaction has succeeded.\n${numCertificates} certificate${numCertificates > 1 ? 's' : ''} ${
            numCertificates > 1 ? 'have' : 'has'
          } been created`
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
        setIsAddingCertificates(false);
        setCertificates(null);
      });
  }

  function handleCancel() {
    setIsAddingCertificates(false);
  }
  function handleDelCertificate(id: string) {
    if (certificates) {
      if (certificates.length == 1) {
        setCertificates(null);
      } else {
        setCertificates((prevState) => {
          return prevState && prevState.filter((certificate) => certificate.certificateId != id);
        });
      }
    }
  }
  const initialValues: IFormikCertificate = {
    certificateId: '',
    ids: null
  };

  return (
    <div className={`${styles.layout} ${styles.minH40}`}>
      <div className={styles.header}>
        <h1>Certify Token Types</h1>
        <button className={styles.closeBtn} onClick={handleCancel}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <div className={styles.content}>
        <div>
          <div className={styles.form}>
            <Formik initialValues={initialValues} onSubmit={(values, resetForm) => handleFormSubmit(values, resetForm)}>
              {({ resetForm }) => {
                return (
                  <Form>
                    <div className={styles.field}>
                      <Label htmlFor="certificateId">Certificate Id *</Label>
                      <Field name="certificateId" />
                      <ErrorMessage name="certificateId" component="div" className={styles.fieldError} />
                    </div>
                    <div className={styles.field}>
                      <Label htmlFor="ids">Token types *</Label>
                      <div className={styles.fieldBtnPair}>
                        <div>
                          <Field
                            name="ids"
                            component={TokenTypesDropdownMulti}
                            options={options}
                            validate={(value: string | null) => handleSelectValidation(value, 'Token type')}
                          />
                        </div>
                      </div>
                      <ErrorMessage name="ids" component="div" className={styles.fieldError} />
                    </div>
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
          {certificates && certificates.length > 0 && (
            <div className={styles.carousel}>
              <Carousel responsive={carouselResponsive}>
                {certificates.map((certificate) => {
                  return (
                    <CertifyTokenTypesCard
                      key={certificate.certificateId}
                      handleDelCertificate={handleDelCertificate}
                      {...certificate}
                    />
                  );
                })}
              </Carousel>
            </div>
          )}
        </div>
      </div>
      <div className={styles.actionBtns}>
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!(certificates && certificates.length > 0)}
        >
          Certify
        </button>
        <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CertifyTokenTypes;
