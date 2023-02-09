export const bytes32Data = '0x0000000000000000000000000000000000000000000000000000000000000000';

export const dictOlives = {
  unitsToMint: 1500000000, // 1500000
  unitsToBurn: 1,
  unitsToEscrow: 100000000, // 100000
  picual: {
    id: '9219876543200',
    tokenId1: '1502',
    tokenId2: '1503',
    tokenId3: '1504'
  },
  arbequina: {
    id: '9219876543300',
    tokenId1: '1105',
    tokenId2: '1106',
    tokenId3: '1107'
  },
  hojiblanca: { id: '9219876543400', tokenId1: '1000581', tokenId2: '1000582' },
  price: 10.0e18
};

export const dictBottle = {
  unitsToMint: 1500,
  unitsToBurn: 1,
  unitsToEscrow: 500,
  glass: { id1: '6219876543211', id2: '4219876543211', tokenId1: '1023584', tokenId2: '1023585' },
  plastic: { id1: '7219876543211', id2: '5219876543211', tokenId1: '1023574', tokenId2: '1023575' },
  price: 1.0e18
};

export const dictOliveOil = {
  unitsToMint: 10000000, // 10000
  unitsToBurn: 50,
  unitsToEscrow: 900000, // 900
  extraVirginIntense: {
    olivesUnits: 7, // 7g to mint 1ml
    id: '0123456789123',
    tokenId1: '1013583',
    tokenId2: '1013584'
  },
  extraVirginSmooth: {
    olivesUnits: 6,
    id: '0123456789125',
    tokenId1: '1012583',
    tokenId2: '1012584'
  },
  extraVirginMedium: {
    id: '0123456788125',
    tokenId1: '1011583',
    tokenId2: '1011584'
  },
  price: 100.0e18
};

export const dictOliveOilBottle = {
  unitsToMint: 100,
  unitsToBurn: 1,
  unitsToEscrow: 30,
  unitsToPack: 30,
  price: 25000,
  extraVirginIntenseGlass: {
    oliveOilUnits: 750,
    bottleUnits: 1,
    id: '0123456789127',
    tokenId1: '1072583',
    tokenId2: '1072584'
  },
  extraVirginSmoothPlastic: {
    oliveOilUnits: 5000,
    bottleUnits: 1,
    id: '0123456789129',
    tokenId1: '1077583',
    tokenId2: '1077584'
  }
};

export const dictPallet = {
  price: 110.0e18,
  bottlingPlant: {
    id1: '(01)0123456388125',
    id2: '(01)0123456387126',
    id3: '(01)0123456387127'
  },
  distributor: {
    id1: '(02)0123456388125',
    id2: '(02)0123456387126',
    id3: '(02)0123456387127'
  },
  default: {
    id1: '(00)0123456388125',
    id2: '(00)0123456387126',
    id3: '(00)0123456387127'
  }
};

export const dictCertificate = {
  bottles: { hQGlass750: '5544876543211C' },
  olives: { hQPicual: '6644876543211C', mQArbequina: '7744876543211C' },
  oliveOil: {
    extraVirginIntense: '5544456789123C',
    extraVirginSmooth: '6644456789123C'
  }
};
