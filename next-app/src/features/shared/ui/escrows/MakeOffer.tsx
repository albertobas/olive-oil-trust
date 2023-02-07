import { Dispatch, SetStateAction, useState } from 'react';
import styles from 'next-app/src/features/shared/styles/modules/forms/Form.module.css';
import { Formik, Form, Field, FormikHelpers, ErrorMessage } from 'formik';
import { Root as Label } from '@radix-ui/react-label';
import useSignedMemberContract from 'next-app/src/features/shared/ui/hooks/useSignedMemberContract';
import FallbackMessage from 'next-app/src/features/shared/ui/fallbackMessage/FallbackMessage';
import { toast } from 'react-toastify';
import { IEscrow } from 'next-app/src/features/shared/core/entities/Escrows';
import { IFormikMakeOffer } from 'next-app/src/features/management/utils/interfaces';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { FaTimes } from 'react-icons/fa';
import { IModalInfo } from 'next-app/src/features/shared/ui/utils/interfaces';
import { transferMakeOffer } from 'next-app/src/features/management/utils/helpers';
import { handleAddressValidation, handlePriceValidation } from 'next-app/src/features/shared/ui/utils/helpers';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import { ImPaste } from 'react-icons/im';
import { renderToast } from 'next-app/src/shared/utils/helpers';
import PriceLabel from 'next-app/src/features/shared/ui/forms/PriceLabel';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

type Props = {
  escrow: IEscrow;
  setModalInfo: Dispatch<SetStateAction<IModalInfo | null>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

function MakeOffer({ escrow, setModalInfo, setIsModalOpen }: Props): JSX.Element {
  const { error, data } = useSignedMemberContract();
  const accounState = useAppSelector((state) => state.account);
  const [priceUnit, setPriceUnit] = useState<'wei' | 'gwei' | 'ether'>('ether');

  if (error) {
    return (
      <div className={styles.layoutFit}>
        <div className={styles.header}>
          <h1>Make Offer</h1>
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

  function handleSubmit({ price, buyerWallet }: IFormikMakeOffer, { resetForm }: FormikHelpers<IFormikMakeOffer>) {
    const toastId = toast.loading('Waiting for wallet response...');
    const parsedPrice =
      priceUnit === 'ether'
        ? (parseInt(price) * 1e18).toString()
        : priceUnit === 'gwei'
        ? (parseInt(price) * 1e9).toString()
        : price;
    transferMakeOffer(data, escrow, parsedPrice, buyerWallet)
      .then(() => {
        renderToast(toastId, 'The transaction has succeeded.');
        console.log(
          `The transaction has succeeded.\nAn offer of ${parsedPrice} has been made to the escrow ${escrow.id}.`
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
        setIsModalOpen(false);
        setModalInfo(null);
      });
  }

  function handleCancel() {
    setIsModalOpen(false);
  }

  const initialValues: IFormikMakeOffer = {
    buyerWallet: '',
    price: ''
  };
  const account = accounState.data ? accounState.data.account : null;

  return (
    <div className={styles.layoutFit}>
      <div className={styles.header}>
        <h1>Make Offer</h1>
        <button className={styles.closeBtn} onClick={handleCancel}>
          <SVG icon={FaTimes} />
        </button>
      </div>
      <div className={styles.form}>
        <Formik initialValues={initialValues} onSubmit={(values, resetForm) => handleSubmit(values, resetForm)}>
          {({ values: { price, buyerWallet }, resetForm, setFieldValue }) => {
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
                <div className={styles.field}>
                  <PriceLabel priceUnit={priceUnit} handlePriceUnitClick={handlePriceUnitClick} />
                  <Field name="price" validate={handlePriceValidation} />
                  <ErrorMessage name="price" component="div" className={styles.fieldError} />
                </div>
                <div className={styles.formSubmit}>
                  <button type="submit" onClick={() => resetForm()}>
                    Reset form
                  </button>
                </div>
                <div className={styles.actionBtns}>
                  <button
                    className={styles.submitBtn}
                    type="submit"
                    disabled={!(buyerWallet.length > 0 && price.length > 0)}
                  >
                    Make Offer
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
    </div>
  );
}

export default MakeOffer;
