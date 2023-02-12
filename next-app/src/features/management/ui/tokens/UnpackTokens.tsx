import { Dispatch, SetStateAction, useMemo } from 'react';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import { IItem } from 'next-app/src/features/shared/utils/interfaces';
import { IFormikUnpackToken } from 'next-app/src/features/management/utils/interfaces';
import { toast } from 'react-toastify';
import { IToken } from 'next-app/src/features/shared/core/entities/Tokens';
import styles from 'src/features/shared/styles/modules/forms/Form.module.css';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { Root as Label } from '@radix-ui/react-label';
import { formatBytes32String } from 'ethers/lib/utils';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { renderToast } from 'next-app/src/shared/utils/helpers';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { FaTimes } from 'react-icons/fa';
import TokensDropdownMulti from 'next-app/src/features/shared/ui/tokens/TokensDropdownMulti';
import { handleSelectValidation } from 'next-app/src/features/shared/ui/utils/helpers';
import { transferUnpackTokens } from 'next-app/src/features/management/utils/helpers';

type Props = {
  industrialUnitTokens: IToken[];
  unpacker: 'BottlingPlant' | 'Distributor' | 'Retailer';
  setIsUnpackingTokens: Dispatch<SetStateAction<boolean>>;
};

function UnpackTokens({ industrialUnitTokens, unpacker, setIsUnpackingTokens }: Props): JSX.Element {
  const { error, data } = useSignedMemberContract();

  const tokensRecords = useMemo(() => {
    if (industrialUnitTokens.length > 0) {
      const tokens: Record<string, { identifier: string; contract: string; type: string | null }> = {};
      industrialUnitTokens.forEach(
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
  }, [industrialUnitTokens]);

  const tokensOptions = useMemo<IItem[] | null>(() => {
    if (industrialUnitTokens) {
      return industrialUnitTokens.map((token) => {
        return {
          label: `Pallet ${token.identifier}`,
          value: token.id
        };
      });
    }
    return null;
  }, [industrialUnitTokens]);

  if (error) {
    return (
      <div className={styles.layoutFit}>
        <div className={styles.header}>
          <h1>Unpack Pallets</h1>
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
    setIsUnpackingTokens(false);
  }

  function handleSubmit({ ids }: IFormikUnpackToken, { resetForm }: FormikHelpers<IFormikUnpackToken>) {
    const tokenAddresses: string[] = [];
    const tokenIds: string[] = [];
    if (tokensRecords) {
      if (ids) {
        for (let i = 0; i < ids.length; i++) {
          const id = ids[i];
          if (id) {
            tokenAddresses.push(tokensRecords[id].contract);
            tokenIds.push(formatBytes32String(tokensRecords[id].identifier));
          }
        }
      }
    }
    const toastId = toast.loading('Waiting for wallet response...');

    transferUnpackTokens(data, ids, tokenAddresses, tokenIds, unpacker)
      .then((numTokens) => {
        renderToast(toastId, 'The transaction has succeeded.');
        console.log(
          `The transaction has succeeded.\n${numTokens} token${numTokens > 1 ? 's' : ''} ${
            numTokens > 1 ? 'have' : 'has'
          } been unpacked`
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
        setIsUnpackingTokens(false);
      });
  }

  const initialValues: IFormikUnpackToken = {
    ids: null
  };

  return (
    <div className={`${styles.layout} ${styles.minH30}`}>
      <div className={styles.header}>
        <h1>Unpack Pallets</h1>
        <button className={styles.closeBtn} onClick={handleCancel}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <Formik initialValues={initialValues} onSubmit={(values, resetForm) => handleSubmit(values, resetForm)}>
        {({ values, resetForm }) => (
          <Form className={styles.content}>
            <div className={styles.form}>
              <div className={styles.field}>
                <Label htmlFor="ids">Pallets</Label>
                <div className={styles.fieldBtnPair}>
                  <div>
                    <Field
                      name="ids"
                      component={TokensDropdownMulti}
                      options={tokensOptions}
                      validate={(value: string | null) => handleSelectValidation(value, 'pallet id')}
                    />
                  </div>
                </div>
                <ErrorMessage name="ids" component="div" className={styles.fieldError} />
              </div>
              <div className={styles.formSubmit}>
                <button type="reset" onClick={() => resetForm()}>
                  Reset form
                </button>
              </div>
            </div>
            <div className={styles.actionBtns}>
              <button
                className={styles.submitBtn}
                type="submit"
                disabled={!(values && values.ids && values.ids.length > 0)}
              >
                Unpack
              </button>
              <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default UnpackTokens;
