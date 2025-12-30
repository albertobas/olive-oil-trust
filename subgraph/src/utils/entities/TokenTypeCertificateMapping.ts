import { TokenTypeCertificateMapping } from '../../generated/types/schema';
import { separator } from '../../utils/constants';

export function registerTokenTypeCertificateMapping(tokenTypeId: string, certificateId: string): void {
  let id = tokenTypeId.concat(separator.concat(certificateId));
  let mapping = new TokenTypeCertificateMapping(id);
  mapping.tokenType = tokenTypeId;
  mapping.certificate = certificateId;
  mapping.save();
}
