export const pollInterval = 2500; // in miliseconds (Set undefined for hooks to disable polling).

export const revalidateInterval = 10; // in seconds.

export const sortCertificateCardsRecords = {
  certifier: 'Certifier',
  date: 'Date',
  certificateId: 'Id',
  title: 'Title'
};

export const sortEscrowCardsRecords = {
  date: 'Date',
  etherBalance: 'Ether balance',
  seller: 'Seller',
  state: 'State',
  title: 'Title'
};

export const sortTokenCardsRecords = {
  date: 'Date',
  title: 'Title',
  type: 'Token type',
  typeId: 'Token type Id'
};

export const sortTokenTypeCardsRecords = {
  date: 'Date',
  numInstructions: 'Number of instructions',
  title: 'Title',
  type: 'Token type',
  typeId: 'Token type Id'
};
