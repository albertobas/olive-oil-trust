import { IMetadata } from 'next-app/src/features/shared/core/entities/Metadata';
import { MetadataRawType } from 'next-app/src/features/shared/utils/interfaces';

export function getMetadata({
  bottleQuality,
  bottleMaterial,
  bottleSize,
  description,
  imageHeight,
  imagePath,
  imageWidth,
  oliveQuality,
  oliveOilAcidity,
  oliveOilAroma,
  oliveOilBitterness,
  oliveOilColour,
  oliveOilFruitness,
  oliveOilIntensity,
  oliveOilItching,
  oliveOrigin,
  title
}: MetadataRawType): IMetadata | null {
  if (
    bottleQuality ||
    bottleMaterial ||
    bottleSize ||
    description ||
    imageHeight ||
    imagePath ||
    imageWidth ||
    oliveQuality ||
    oliveOilAcidity ||
    oliveOilAroma ||
    oliveOilBitterness ||
    oliveOilColour ||
    oliveOilFruitness ||
    oliveOilIntensity ||
    oliveOilItching ||
    oliveOrigin ||
    title
  ) {
    return {
      bottle:
        bottleMaterial || bottleQuality || bottleSize
          ? {
              quality: bottleQuality ?? null,
              material: bottleMaterial ?? null,
              size: bottleSize ? parseInt(bottleSize) : null
            }
          : null,
      description: description ?? null,
      image:
        imageHeight || imagePath || imageWidth
          ? {
              path: imagePath ?? null,
              width: parseInt(imageWidth) ?? null,
              height: parseInt(imageHeight) ?? null
            }
          : null,
      olive:
        oliveQuality || oliveOrigin
          ? {
              quality: oliveQuality ?? null,
              origin: oliveOrigin ?? null
            }
          : null,
      oliveOil:
        oliveOilAcidity ||
        oliveOilAcidity ||
        oliveOilAroma ||
        oliveOilBitterness ||
        oliveOilColour ||
        oliveOilFruitness ||
        oliveOilIntensity ||
        oliveOilItching ||
        oliveOrigin
          ? {
              acidity: parseFloat(oliveOilAcidity) ?? null,
              aroma: oliveOilAroma ?? null,
              bitterness: oliveOilBitterness ?? null,
              colour: oliveOilColour ?? null,
              fruitness: oliveOilFruitness ?? null,
              intensity: oliveOilIntensity ?? null,
              itching: oliveOilItching ?? null
            }
          : null,
      title: title ?? null
    };
  }
  return null;
}
