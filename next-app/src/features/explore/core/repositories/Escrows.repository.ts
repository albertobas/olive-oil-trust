import { IAllEscrowsOOT } from 'next-app/src/features/explore/core/entities/EscrowsOOT';

interface EscrowsRepository {
  getAll(endpoint: string): Promise<IAllEscrowsOOT | undefined>;
}

export default EscrowsRepository;
