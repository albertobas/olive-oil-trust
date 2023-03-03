import { TokenType } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { AllCertificatesQuery, AllTokenTypesQuery, TokenTypeByIdQuery } from 'next-app/.graphclient';
import { getCertificate } from 'next-app/src/features/shared/utils/helpers/certificate';
import { parseEvent } from 'next-app/src/features/shared/utils/helpers/helpers';
import { getMetadata } from 'next-app/src/features/shared/utils/helpers/metadata';
import { getMember } from 'next-app/src/features/shared/utils/helpers/member';
import { TokenTypeInstruction } from 'next-app/src/features/shared/core/entities/TokenTypes';
import { checkModule } from 'next-app/src/features/shared/utils/helpers/helpers';
import { TokenTypeRawType } from 'next-app/src/features/shared/utils/interfaces';

export function getTokenType(type: TokenTypeRawType): TokenType {
  return {
    id: type.id,
    certificates:
      'certificates' in type && type?.certificates && type.certificates.length > 0
        ? type.certificates?.map((certificate) => getCertificate(certificate.certificate))
        : null,
    contract: 'contract' in type ? (type.contract ? type.contract.id : null) : null,
    creationDate: parseInt(type.creationDate),
    identifier: type.identifier,
    instructions: getTokenTypeInstructions(type.instructions),
    instructionsSetEvent: type.tokenTypeInstructionsSet ? parseEvent(type.tokenTypeInstructionsSet) : null,
    metadata: getMetadata(type),
    member:
      'contract' in type
        ? type.contract && type.contract.owner && type.contract.owner.asMemberContract
          ? getMember(type.contract.owner.asMemberContract)
          : null
        : null,
    uri: type.uri ?? null
  };
}

function getTokenTypeInstructions(
  instructionsOOT:
    | AllTokenTypesQuery['tokenTypes'][0]['instructions']
    | NonNullable<AllCertificatesQuery['certificates'][0]['tokenTypes']>[0]['tokenType']['instructions']
    | AllTokenTypesQuery['tokenTypes'][0]['instructions']
    | NonNullable<TokenTypeByIdQuery['tokenType']>['instructions']
): TokenTypeInstruction[] | null {
  if (instructionsOOT && instructionsOOT.length > 0) {
    const instructions: TokenTypeInstruction[] = [];
    for (let i = 0; i < instructionsOOT.length; i++) {
      const instruction = instructionsOOT[i];
      const tokenTypeOrCertificateId = instruction.instructedCertificate
        ? instruction.instructedCertificate.id
        : instruction.instructedTokenType
        ? instruction.instructedTokenType.id
        : null;
      const tokenTypeOrCertificateTitle = instruction.instructedCertificate
        ? instruction.instructedCertificate.title
        : instruction.instructedTokenType
        ? instruction.instructedTokenType.title
        : null;
      if (tokenTypeOrCertificateId && tokenTypeOrCertificateTitle) {
        const certificateTokenTypeRole = instruction.instructedCertificate
          ? instruction.instructedCertificate.tokenTypes
            ? instruction.instructedCertificate.tokenTypes[0].tokenType.contract.owner?.asMemberContract?.role ?? null
            : null
          : null;
        const tokenTypeRole = instruction.instructedTokenType?.contract.owner?.asMemberContract?.role ?? null;
        instructions.push({
          amount: instruction.instructedTokenAmount ? parseInt(instruction.instructedTokenAmount) : null,
          instructorModuleId: certificateTokenTypeRole
            ? checkModule(certificateTokenTypeRole)
            : tokenTypeRole
            ? checkModule(tokenTypeRole)
            : null,
          id: tokenTypeOrCertificateId,
          isCertificate: instruction.instructedCertificate ? true : false,
          title: tokenTypeOrCertificateTitle,
          certifiedTokenTypes: instruction.instructedCertificate
            ? instruction.instructedCertificate.tokenTypes
              ? instruction.instructedCertificate.tokenTypes.map((type) => {
                  return { id: type.tokenType.id, title: type.tokenType.title ?? null };
                })
              : null
            : null
        });
      }
    }
    return instructions;
  }
  return null;
}

export const sortTokenTypeArray = (data: TokenType[], sortValue: string | undefined, reverse: boolean): TokenType[] => {
  if (reverse) {
    if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.instructionsSetEvent && b.instructionsSetEvent
          ? a.instructionsSetEvent.transaction.timestamp > b.instructionsSetEvent.transaction.timestamp
            ? -1
            : a.instructionsSetEvent.transaction.timestamp < b.instructionsSetEvent.transaction.timestamp
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'numInstructions') {
      return data.sort((a, b) =>
        a.instructions && b.instructions
          ? a.instructions.length > b.instructions.length
            ? -1
            : a.instructions.length < b.instructions.length
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
    } else if (sortValue === 'type') {
      return data.sort((a, b) =>
        a.metadata?.title && b?.metadata?.title
          ? a.metadata?.title > b.metadata?.title
            ? -1
            : a.metadata?.title < b.metadata?.title
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'typeId') {
      return data.sort((a, b) => (a.id > b.id ? -1 : a.id < b.id ? 1 : 0));
    } else return data;
  } else {
    if (sortValue === 'date') {
      return data.sort((a, b) =>
        a.instructionsSetEvent && b.instructionsSetEvent
          ? a.instructionsSetEvent.transaction.timestamp < b.instructionsSetEvent.transaction.timestamp
            ? -1
            : a.instructionsSetEvent.transaction.timestamp > b.instructionsSetEvent.transaction.timestamp
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'numInstructions') {
      return data.sort((a, b) =>
        a.instructions && b.instructions
          ? a.instructions.length < b.instructions.length
            ? -1
            : a.instructions.length > b.instructions.length
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
    } else if (sortValue === 'type') {
      return data.sort((a, b) =>
        a.metadata?.title && b?.metadata?.title
          ? a.metadata?.title < b.metadata?.title
            ? -1
            : a.metadata?.title > b.metadata?.title
            ? 1
            : 0
          : 0
      );
    } else if (sortValue === 'typeId') {
      return data.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
    } else return data;
  }
};
