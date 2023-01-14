import { TokenTypeCertificateMapping } from 'subgraph/src/generated/types/schema';
import { separator } from 'subgraph/src/utils/constants';

export function registerTokenTypeCertificateMapping(tokenTypeId: string, certificateId: string): void {
  let id = tokenTypeId.concat(separator.concat(certificateId));
  let mapping = new TokenTypeCertificateMapping(id);
  mapping.tokenType = tokenTypeId;
  mapping.certificate = certificateId;
  mapping.save();
}
