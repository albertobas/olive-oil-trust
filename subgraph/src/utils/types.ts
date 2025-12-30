export class EscrowState {
  NON_ACTIVE: string = '';
  ACTIVE: string = '';
  REVERTED_BEFORE_PAYMENT: string = '';
  ETHER_DEPOSITED: string = '';
  REVERTED_AFTER_PAYMENT: string = '';
  CLOSED: string = '';
}

export class BottleMaterial {
  GLASS: string = '';
  PLASTIC: string = '';
}

export class LightDarkScale {
  LIGHT: string = '';
  LIGHT_MEDIUM: string = '';
  MEDIUM: string = '';
  MEDIUM_DARK: string = '';
  DARK: string = '';
}

export class LowHighScale {
  LOW: string = '';
  LOW_MEDIUM: string = '';
  MEDIUM: string = '';
  MEDIUM_HIGH: string = '';
  HIGH: string = '';
}

export class Metadata {
  bottleQuality: string = '';
  bottleMaterial: string = '';
  bottleSize: string = '';
  description: string = '';
  imageHeight: string = '';
  imagePath: string = '';
  imageWidth: string = '';
  oliveOilAcidity: string = '';
  oliveOilAroma: string = '';
  oliveOilBitterness: string = '';
  oliveOilColour: string = '';
  oliveOilFruitness: string = '';
  oliveOilIntensity: string = '';
  oliveOilItching: string = '';
  oliveQuality: string = '';
  oliveOrigin: string = '';
  title: string = '';
}

export class OliveOrigin {
  FLOOR: string = '';
  TREE: string = '';
}
