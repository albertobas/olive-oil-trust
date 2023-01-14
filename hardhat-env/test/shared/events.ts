export enum EventsActor {
  Received = 'Received'
}

export enum EventsBaseMember {
  NameSet = 'NameSet'
}

export enum EventsBaseToken {
  BatchCertified = 'BatchCertified',
  BatchTransferred = 'BatchTransferred',
  TokenCertified = 'TokenCertified',
  TokenTransferred = 'TokenTransferred'
}

export enum EventsCertificate {
  BatchCertified = 'BatchCertified',
  TokenCertified = 'TokenCertified'
}

export enum EventsDependentCreator {
  TokenAncestrySet = 'TokenAncestrySet'
}

export enum EventsDependentTokenUpgradeable {
  TokenTypeInstructionsSet = 'TokenTypeInstructionsSet',
  TokenTypesInstructionsSet = 'TokenTypesInstructionsSet'
}

export enum EventsERC1155 {
  ApprovalForAll = 'ApprovalForAll',
  TransferBatch = 'TransferBatch',
  TransferSingle = 'TransferSingle'
}

export enum EventsEscrow {
  BatchDeposited = 'BatchDeposited',
  PaymentCancelled = 'PaymentCancelled',
  Closed = 'Closed',
  EtherDeposited = 'EtherDeposited',
  EtherWithdrawn = 'EtherWithdrawn',
  RevertedAfterPayment = 'RevertedAfterPayment',
  RevertedBeforePayment = 'RevertedBeforePayment',
  TokenDeposited = 'TokenDeposited',
  TokenWithdrawn = 'TokenWithdrawn',
  TokensWithdrawn = 'TokensWithdrawn'
}

export enum EventsIndustrialUnitToken {
  BatchPacked = 'BatchPacked',
  BatchUnpacked = 'BatchUnpacked',
  BatchTransferred = 'BatchTransferred',
  SinglePacked = 'SinglePacked',
  TokenTransferred = 'TokenTransferred',
  SingleUnpacked = 'SingleUnpacked'
}
