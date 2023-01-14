import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { CertificateContract, Instruction, TokenContract, TokenType } from 'subgraph/src/generated/types/schema';
import { separator } from 'subgraph/src/utils/constants';
import { getCertificateId } from 'subgraph/src/utils/entities/Certificate';
import { getTokenTypeId } from 'subgraph/src/utils/entities/TokenType';

export function registerInstruction(
  index: number,
  tokenType: TokenType,
  TokenTypeInstructionsSetId: string,
  instructedAddress: Bytes,
  instructedTokenAmount: BigInt,
  instructedTypeOrCertificateId: Bytes
): void {
  let id = index
    .toString()
    .concat(separator)
    .concat(tokenType.identifier)
    .concat(separator)
    .concat(instructedAddress.toHex())
    .concat(separator)
    .concat(instructedTypeOrCertificateId.toString());
  let instruction = new Instruction(id);

  // instructedContract can only raise one abstraction, certificateContract or tokenContract,
  // but not both, i.e. the instructed address either refers to a certificate entity or a token
  // entity but both entities cannot have the same address. If they did, avoid assigning a reference.
  let tokenContract = TokenContract.load(instructedAddress);
  let certificateContract = CertificateContract.load(instructedAddress);

  if (!(certificateContract && tokenContract)) {
    if (certificateContract) {
      let instructedCertificateId = getCertificateId(certificateContract.id, instructedTypeOrCertificateId);
      instruction.instructedCertificate = instructedCertificateId;
    }
    if (tokenContract) {
      let instructedTypeId = getTokenTypeId(tokenContract.id, instructedTypeOrCertificateId);
      let instructedTokenType = TokenType.load(instructedTypeId);
      if (instructedTokenType) {
        instruction.instructedTokenType = instructedTokenType.id;
      }
    }
  }
  instruction.tokenTypeInstructionsSet = TokenTypeInstructionsSetId;
  instruction.instructedTokenAmount = instructedTokenAmount;
  instruction.tokenType = tokenType.id;
  instruction.save();
}
