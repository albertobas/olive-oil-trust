import { Dispatch, SetStateAction } from 'react';
import styles from 'next-app/src/features/shared/styles/modules/forms/Form.module.css';
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import { Root as Label } from '@radix-ui/react-label';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { toast } from 'react-toastify';
import { IEscrow } from 'next-app/src/features/shared/core/entities/Escrows';
import { IFormikMakePayment } from 'next-app/src/features/management/utils/interfaces';
import useSignedContract from 'next-app/src/features/shared/ui/hooks/useSignedContract';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { FaTimes } from 'react-icons/fa';
import { IModalInfo } from 'next-app/src/features/shared/ui/utils/interfaces';
import { transferMakePayment } from 'next-app/src/features/management/utils/helpers';
import { handleAddressValidation } from 'next-app/src/features/shared/ui/utils/helpers';
import { renderToast } from 'next-app/src/shared/utils/helpers';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import { ImPaste } from 'react-icons/im';
import EscrowErrorMessage from 'next-app/src/features/shared/ui/escrows/EscrowErrorMessage';
import { isMember } from 'next-app/src/shared/utils/constants';
import { Module } from 'next-app/src/shared/utils/interfaces';

type Props = {
  escrow: IEscrow;
  moduleId: Module | null;
  setModalInfo: Dispatch<SetStateAction<IModalInfo | null>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

function MakePayment({ escrow, moduleId, setModalInfo, setIsModalOpen }: Props): JSX.Element {
  const signedMemberContract = useSignedMemberContract();
  const { id, seller, price } = escrow;
  const signedEscrowContract = useSignedContract(
    seller && seller.name ? seller.name.replace(/ /g, '') + 'Escrow' : null
  );
  const accounState = useAppSelector((state) => state.account);
  const isMember_ = Boolean(moduleId && isMember(moduleId));

  if (isMember_ && (signedMemberContract.error || signedEscrowContract.error)) {
    return (
      <EscrowErrorMessage error="An abstraction of the contract could not be created" setIsModalOpen={setIsModalOpen} />
    );
  }

  if (signedEscrowContract.error) {
    return (
      <EscrowErrorMessage error="An abstraction of the contract could not be created" setIsModalOpen={setIsModalOpen} />
    );
  }

  if ((isMember_ && !signedMemberContract.data) || !signedEscrowContract.data) {
    // loading
    return <FallbackMessage />;
  }

  function handleSubmit(formikPayment: IFormikMakePayment, { resetForm }: FormikHelpers<IFormikMakePayment>) {
    const toastId = toast.loading('Waiting for wallet response...');
    transferMakePayment(signedMemberContract.data, signedEscrowContract.data, escrow, moduleId, formikPayment)
      .then(() => {
        renderToast(toastId, 'The transaction has succeeded.');
        console.log(`The transaction has succeeded.\nA payment of ${price} has been made to the escrow ${id}.`);
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
        setIsModalOpen(false);
        setModalInfo(null);
      });
  }
  function handleCancel() {
    setIsModalOpen(false);
  }

  const initialValues: IFormikMakePayment = { buyerWallet: '' };

  const account = accounState.data ? accounState.data.account : null;

  return (
    <div className={styles.layoutFit}>
      <div className={styles.header}>
        <h1>Make Payment</h1>
        <button className={styles.closeBtn} onClick={handleCancel}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <div className={styles.form}>
        <Formik initialValues={initialValues} onSubmit={(values, resetForm) => handleSubmit(values, resetForm)}>
          {({ values, resetForm, setFieldValue }) => (
            <Form>
              <div className={styles.fieldBtnPair}>
                <div className={styles.field}>
                  <Label htmlFor="buyerWallet">Buyer wallet *</Label>
                  <Field name="buyerWallet" validate={handleAddressValidation} />
                </div>
                <ErrorMessage name="buyerWallet" component="div" className={styles.fieldError} />
                {account && (
                  <button
                    type="button"
                    title="Paste wallet address"
                    onClick={() => setFieldValue('buyerWallet', account)}
                  >
                    <SVG icon={ImPaste} />
                  </button>
                )}
              </div>
              <div className={styles.formSubmit}>
                <button type="submit" onClick={() => resetForm()}>
                  Reset form
                </button>
              </div>
              <div className={styles.actionBtns}>
                <button className={styles.submitBtn} type="submit" disabled={!(values.buyerWallet.length > 0)}>
                  Make Payment
                </button>
                <button className={styles.cancelBtn} type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default MakePayment;
