export interface Metadata {
  bottle: {
    quality: string | null;
    material: string | null;
    size: number | null;
  } | null;
  description: string | null;
  image: {
    path: string | null;
    width: number | null;
    height: number | null;
  } | null;
  olive: {
    quality: string | null;
    origin: string | null;
  } | null;
  oliveOil: {
    acidity: number | null;
    aroma: string | null;
    bitterness: string | null;
    colour: string | null;
    fruitness: string | null;
    intensity: string | null;
    itching: string | null;
  } | null;
  title: string | null;
}
