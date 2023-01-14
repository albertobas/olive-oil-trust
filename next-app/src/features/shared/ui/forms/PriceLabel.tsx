import { Root as Label } from '@radix-ui/react-label';

type Props = { priceUnit: 'ether' | 'gwei' | 'wei'; handlePriceUnitClick(newUnit: 'ether' | 'gwei' | 'wei'): void };

function PriceLabel({ priceUnit, handlePriceUnitClick }: Props): JSX.Element {
  return (
    <div>
      <Label htmlFor={'price'}>Price *</Label>
      <button disabled={priceUnit === 'ether'} type="button" onClick={() => handlePriceUnitClick('ether')}>
        Ether
      </button>
      <button disabled={priceUnit === 'gwei'} type="button" onClick={() => handlePriceUnitClick('gwei')}>
        Gwei
      </button>
      <button disabled={priceUnit === 'wei'} type="button" onClick={() => handlePriceUnitClick('wei')}>
        Wei
      </button>
    </div>
  );
}

export default PriceLabel;
