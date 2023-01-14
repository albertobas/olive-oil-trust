import { ICertificateOOT } from 'next-app/src/features/shared/core/entities/CertificatesOOT';

export interface IAllCertificatesOOT {
  certificates: ICertificateOOT[] | null;
}

export interface ICertificateByIdOOT {
  certificate: ICertificateOOT | null;
}
