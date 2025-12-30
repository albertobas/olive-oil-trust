import { BottleMaterial, EscrowState, LightDarkScale, LowHighScale, OliveOrigin } from '../utils/types';

export let escrowState: EscrowState = {
  NON_ACTIVE: 'NonActive',
  ACTIVE: 'Active',
  REVERTED_BEFORE_PAYMENT: 'RevertedBeforePayment',
  ETHER_DEPOSITED: 'EtherDeposited',
  REVERTED_AFTER_PAYMENT: 'RevertedAfterPayment',
  CLOSED: 'Closed'
};

export let lightDarkScale: LightDarkScale = {
  LIGHT: 'Light',
  LIGHT_MEDIUM: 'Light - Medium',
  MEDIUM: 'Medium',
  MEDIUM_DARK: 'Medium - Dark',
  DARK: 'Dark'
};

export let lowHighScale: LowHighScale = {
  LOW: 'Light',
  LOW_MEDIUM: 'Low - Medium',
  MEDIUM: 'Medium',
  MEDIUM_HIGH: 'Medium - High',
  HIGH: 'Dark'
};

export let oliveOrigin: OliveOrigin = {
  FLOOR: 'Floor',
  TREE: 'Tree'
};

export let bottleMaterial: BottleMaterial = {
  GLASS: 'Glass',
  PLASTIC: 'Plastic'
};

export let separator = '_';
