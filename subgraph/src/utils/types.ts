export class EscrowState {
  NON_ACTIVE: string;
  ACTIVE: string;
  REVERTED_BEFORE_PAYMENT: string;
  ETHER_DEPOSITED: string;
  REVERTED_AFTER_PAYMENT: string;
  CLOSED: string;
}

export class BottleMaterial {
  GLASS: string;
  PLASTIC: string;
}

export class LightDarkScale {
  LIGHT: string;
  LIGHT_MEDIUM: string;
  MEDIUM: string;
  MEDIUM_DARK: string;
  DARK: string;
}

export class LowHighScale {
  LOW: string;
  LOW_MEDIUM: string;
  MEDIUM: string;
  MEDIUM_HIGH: string;
  HIGH: string;
}

export class Metadata {
  bottleQuality: string | null;
  bottleMaterial: string | null;
  bottleSize: string | null;
  description: string;
  imageHeight: string | null;
  imagePath: string | null;
  imageWidth: string | null;
  oliveOilAcidity: string | null;
  oliveOilAroma: string | null;
  oliveOilBitterness: string | null;
  oliveOilColour: string | null;
  oliveOilFruitness: string | null;
  oliveOilIntensity: string | null;
  oliveOilItching: string | null;
  oliveQuality: string | null;
  oliveOrigin: string | null;
  title: string;
}

export class OliveOrigin {
  FLOOR: string;
  TREE: string;
}
