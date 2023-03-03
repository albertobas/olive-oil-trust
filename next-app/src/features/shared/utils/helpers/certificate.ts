import { Certificate } from 'next-app/src/features/shared/core/entities/Certificates';
import { getMember } from 'next-app/src/features/shared/utils/helpers/member';
import { parseEvent } from 'next-app/src/features/shared/utils/helpers/helpers';
import { getTokenType } from 'next-app/src/features/shared/utils/helpers/tokenType';
import { getMetadata } from 'next-app/src/features/shared/utils/helpers/metadata';
import { CertificateRawType } from 'next-app/src/features/shared/utils/interfaces';

export function getCertificate(certificate: CertificateRawType): Certificate {
  return {
    id: certificate.id,
    contract: certificate.contract.id,
    certification: certificate.certification?.map((certification) => parseEvent(certification)) ?? null,
    creationDate: parseInt(certificate.creationDate),
    identifier: certificate.identifier,
    member: certificate.contract.owner?.asMemberContract
      ? getMember(certificate.contract.owner.asMemberContract)
      : null,
    tokenTypes:
      'tokenTypes' in certificate ? certificate.tokenTypes?.map((type) => getTokenType(type.tokenType)) ?? null : null,
    metadata: getMetadata(certificate),
    uri: certificate.uri
  };
}

export const sortCertificateArray = (
  data: Certificate[],
  sortValue: string | undefined,
  reverse: boolean
): Certificate[] => {
  if (reverse) {
    if (sortValue === 'certificateId') {
      return data.sort((a, b) => (a.identifier > b.identifier ? -1 : a.identifier < b.identifier ? 1 : 0));
    } else if (sortValue === 'certifier') {
      return data.sort((a, b) =>
        a.member?.name && b.member?.name
          ? a.member.name > b.member?.name
            ? -1
            : a.member?.name < b.member?.name
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.creationDate && b.creationDate
          ? a.creationDate < b.creationDate
            ? -1
            : a.creationDate > b.creationDate
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'title') {
      return data.sort((a, b) =>
        a.metadata && b.metadata && a.metadata.title && b.metadata.title
          ? a.metadata.title > b.metadata.title
            ? -1
            : a.metadata.title < b.metadata.title
            ? 1
            : 0
          : 0
      );
    } else return data;
  } else {
    if (sortValue === 'certificateId') {
      return data.sort((a, b) => (a.identifier < b.identifier ? -1 : a.identifier > b.identifier ? 1 : 0));
    } else if (sortValue === 'certifier') {
      return data.sort((a, b) =>
        a.member?.name && b.member?.name
          ? a.member.name < b.member?.name
            ? -1
            : a.member?.name > b.member?.name
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.creationDate && b.creationDate
          ? a.creationDate < b.creationDate
            ? -1
            : a.creationDate > b.creationDate
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'title') {
      return data.sort((a, b) =>
        a.metadata && b.metadata && a.metadata.title && b.metadata.title
          ? a.metadata.title < b.metadata.title
            ? -1
            : a.metadata.title > b.metadata.title
            ? 1
            : 0
          : 0
      );
    } else return data;
  }
};
