import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { bottleMaterial, lightDarkScale, lowHighScale, oliveOrigin, separator } from 'subgraph/src/utils/constants';
import { Metadata } from 'subgraph/src/utils/types';

export function eventId(transactionHash: Bytes, logIndex: BigInt, id: string | null): string {
  if (id === null) {
    return transactionHash.toHex().concat(separator).concat(logIndex.toString());
  } else {
    return transactionHash
      .toHex()
      .concat(separator)
      .concat(logIndex.toString())
      .concat(separator)
      .concat(id.toString());
  }
}

export function getMetadata(id: string): Metadata | null {
  if (id == '9219876543300') {
    return {
      bottleQuality: null,
      bottleMaterial: null,
      bottleSize: null,
      description:
        'The Arbequina is a cultivar of olives and has recently become one of the dominant olive cultivars in the world.',
      imageHeight: '400',
      imagePath: '/images/9219876543300.jpg',
      imageWidth: '400',
      oliveQuality: lowHighScale.MEDIUM_HIGH,
      oliveOilAcidity: null,
      oliveOilAroma: null,
      oliveOilBitterness: null,
      oliveOilColour: null,
      oliveOilFruitness: null,
      oliveOilIntensity: null,
      oliveOilItching: null,
      oliveOrigin: oliveOrigin.TREE,
      title: 'Medium-High Quality Arbequina'
    };
  } else if (id == '9219876543200') {
    return {
      bottleQuality: null,
      bottleMaterial: null,
      bottleSize: null,
      description: 'The Picual is an olive cultivar from Spain and is the most commonly used for olive production.',
      imageHeight: '400',
      imagePath: '/images/9219876543200.jpg',
      imageWidth: '400',
      oliveQuality: lowHighScale.MEDIUM_HIGH,
      oliveOilAcidity: null,
      oliveOilAroma: null,
      oliveOilBitterness: null,
      oliveOilColour: null,
      oliveOilFruitness: null,
      oliveOilIntensity: null,
      oliveOilItching: null,
      oliveOrigin: oliveOrigin.FLOOR,
      title: 'High Quality Picual'
    };
  } else if (id == '6219876543211') {
    return {
      bottleQuality: lowHighScale.HIGH,
      bottleMaterial: bottleMaterial.GLASS,
      bottleSize: '750',
      description: 'This glass bottles are made ...',
      imageHeight: '400',
      imagePath: '/images/6219876543211.jpg',
      imageWidth: '400',
      oliveQuality: null,
      oliveOilAcidity: null,
      oliveOilAroma: null,
      oliveOilBitterness: null,
      oliveOilColour: null,
      oliveOilFruitness: null,
      oliveOilIntensity: null,
      oliveOilItching: null,
      oliveOrigin: null,
      title: 'High Quality 750 ml Glass Bottle'
    };
  } else if (id == '7219876543211') {
    return {
      bottleQuality: lowHighScale.HIGH,
      bottleMaterial: bottleMaterial.PLASTIC,
      bottleSize: '5000',
      description: 'This plastic bottles are made ...',
      imageHeight: '350',
      imagePath: '/images/7219876543211.jpg',
      imageWidth: '350',
      oliveQuality: null,
      oliveOilAcidity: null,
      oliveOilAroma: null,
      oliveOilBitterness: null,
      oliveOilColour: null,
      oliveOilFruitness: null,
      oliveOilIntensity: null,
      oliveOilItching: null,
      oliveOrigin: null,
      title: 'Medium-High Quality 5 l Plastic Bottle'
    };
  } else if (id == '4219876543211') {
    return {
      bottleQuality: lowHighScale.HIGH,
      bottleMaterial: bottleMaterial.GLASS,
      bottleSize: '750',
      description: 'This glass bottles are made ...',
      imageHeight: '400',
      imagePath: '/images/4219876543211.jpg',
      imageWidth: '400',
      oliveQuality: null,
      oliveOilAcidity: null,
      oliveOilAroma: null,
      oliveOilBitterness: null,
      oliveOilColour: null,
      oliveOilFruitness: null,
      oliveOilIntensity: null,
      oliveOilItching: null,
      oliveOrigin: null,
      title: 'HQ Glass Bottle 750 ml'
    };
  } else if (id == '5219876543211') {
    return {
      bottleQuality: lowHighScale.HIGH,
      bottleMaterial: bottleMaterial.PLASTIC,
      bottleSize: '5000',
      description: 'This plastic bottles are made ...',
      imageHeight: '350',
      imagePath: '/images/5219876543211.jpg',
      imageWidth: '350',
      oliveQuality: null,
      oliveOilAcidity: null,
      oliveOilAroma: null,
      oliveOilBitterness: null,
      oliveOilColour: null,
      oliveOilFruitness: null,
      oliveOilIntensity: null,
      oliveOilItching: null,
      oliveOrigin: null,
      title: 'MHQ Plastic Bottle 5 l'
    };
  } else if (id == '0123456789123') {
    return {
      bottleQuality: null,
      bottleMaterial: null,
      bottleSize: null,
      description: 'The Extra Virgin Olive Oil Intense is made from...',
      imageHeight: '400',
      imagePath: '/images/0123456789123.jpg',
      imageWidth: '400',
      oliveQuality: null,
      oliveOilAcidity: '0.8',
      oliveOilAroma: lowHighScale.MEDIUM_HIGH,
      oliveOilBitterness: lowHighScale.MEDIUM,
      oliveOilColour: lightDarkScale.MEDIUM_DARK,
      oliveOilFruitness: lowHighScale.MEDIUM,
      oliveOilIntensity: lowHighScale.HIGH,
      oliveOilItching: lowHighScale.LOW_MEDIUM,
      oliveOrigin: null,
      title: 'Extra Virgin Intense Olive oil'
    };
  } else if (id == '0123456789125') {
    return {
      bottleQuality: null,
      bottleMaterial: null,
      bottleSize: null,
      description: 'The Extra Virgin Smooth Olive oil is made from...',
      imageHeight: '400',
      imagePath: '/images/0123456789125.jpg',
      imageWidth: '400',
      oliveQuality: null,
      oliveOilAcidity: '0.6',
      oliveOilAroma: lowHighScale.MEDIUM,
      oliveOilBitterness: lowHighScale.LOW_MEDIUM,
      oliveOilColour: lightDarkScale.MEDIUM,
      oliveOilFruitness: lowHighScale.MEDIUM,
      oliveOilIntensity: lowHighScale.MEDIUM_HIGH,
      oliveOilItching: lowHighScale.LOW,
      oliveOrigin: null,
      title: 'Extra Virgin Smooth Olive oil'
    };
  } else if (id == '0123456789127') {
    return {
      bottleQuality: lowHighScale.HIGH,
      bottleMaterial: bottleMaterial.GLASS,
      bottleSize: '750',
      description: 'The Extra Virgin Intense Olive oil 750 ml Glass Bottle is made from...',
      imageHeight: '400',
      imagePath: '/images/0123456789127.jpg',
      imageWidth: '400',
      oliveQuality: null,
      oliveOilAcidity: '0.8',
      oliveOilAroma: lowHighScale.MEDIUM_HIGH,
      oliveOilBitterness: lowHighScale.MEDIUM,
      oliveOilColour: lightDarkScale.MEDIUM_DARK,
      oliveOilFruitness: lowHighScale.MEDIUM,
      oliveOilIntensity: lowHighScale.HIGH,
      oliveOilItching: lowHighScale.LOW_MEDIUM,
      oliveOrigin: null,
      title: 'Extra Virgin Intense Olive oil 750 ml Glass Bottle'
    };
  } else if (id == '0123456789129') {
    return {
      bottleQuality: lowHighScale.HIGH,
      bottleMaterial: bottleMaterial.PLASTIC,
      bottleSize: '5000',
      description: 'The Virgin Smooth Olive oil 5 l Plastic Bottle is made from...',
      imageHeight: '500',
      imagePath: '/images/0123456789129.jpg',
      imageWidth: '500',
      oliveQuality: null,
      oliveOilAcidity: '0.8',
      oliveOilAroma: lowHighScale.MEDIUM,
      oliveOilBitterness: lowHighScale.LOW_MEDIUM,
      oliveOilColour: lightDarkScale.MEDIUM,
      oliveOilFruitness: lowHighScale.MEDIUM,
      oliveOilIntensity: lowHighScale.MEDIUM_HIGH,
      oliveOilItching: lowHighScale.LOW,
      oliveOrigin: null,
      title: 'Virgin Smooth Olive oil 5 l Plastic Bottle'
    };
  } else if (id == '5544876543211C') {
    return {
      bottleQuality: lowHighScale.HIGH,
      bottleMaterial: bottleMaterial.GLASS,
      bottleSize: '750',
      description: 'The High Quality Glass 750 ml certificate ensures ...',
      imageHeight: null,
      imagePath: null,
      imageWidth: null,
      oliveQuality: null,
      oliveOilAcidity: null,
      oliveOilAroma: null,
      oliveOilBitterness: null,
      oliveOilColour: null,
      oliveOilFruitness: null,
      oliveOilIntensity: null,
      oliveOilItching: null,
      oliveOrigin: null,
      title: 'High Quality Glass 750 ml Certificate'
    };
  } else if (id == '5544456789123C') {
    return {
      bottleQuality: null,
      bottleMaterial: null,
      bottleSize: null,
      description: 'The Extra Virgin Intense High Quality certificate ensures ...',
      imageHeight: null,
      imagePath: null,
      imageWidth: null,
      oliveQuality: null,
      oliveOilAcidity: '0.8',
      oliveOilAroma: lowHighScale.MEDIUM_HIGH,
      oliveOilBitterness: lowHighScale.MEDIUM,
      oliveOilColour: lightDarkScale.MEDIUM_DARK,
      oliveOilFruitness: lowHighScale.MEDIUM,
      oliveOilIntensity: lowHighScale.HIGH,
      oliveOilItching: lowHighScale.LOW_MEDIUM,
      oliveOrigin: null,
      title: 'Extra Virgin Intense High Quality Certificate'
    };
  } else return null;
}
